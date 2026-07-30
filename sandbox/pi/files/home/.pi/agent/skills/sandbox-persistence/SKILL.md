---
name: sandbox-persistence
description: Persistently store new pi skills and pi packages (extensions) in the kit so they survive sandbox recreation. Use when creating a new skill (write the skill to sandbox/pi/files/home/.pi/agent/skills/) or when installing a pi extension (add an install step to sandbox/pi/spec.yaml commands.install). This sandbox uses an overlay filesystem — anything written to ~/.pi/ inside the running VM is lost when the sandbox is recreated, so persistent assets must be baked into the kit instead.
---

# Sandbox Persistence

This kit (`sandbox/pi/`) is the source of truth for everything that should
exist in a freshly created sandbox. The running VM is an **overlay** on top
of the kit: writes inside the VM persist for the life of that one VM and
are discarded on recreation. Two kinds of assets must therefore be added
to the kit, not the live VM, in order to be **persistent**:

1. **Pi skills** — new `SKILL.md` files
2. **Pi packages / extensions** — anything you would otherwise `pi install`

Everything else (auth tokens, ephemeral session data, scratch files) is
fine to leave in the VM and is out of scope for this skill.

## When to use

- You are about to create a new skill for this project.
- You are about to `pi install` an extension (npm / git / local path) and
  you want it present in future sandboxes too.
- The user asks to "make this persistent", "bake this into the kit", or
  "survive a sandbox recreate".

If the user explicitly says "just for this VM" or "don't add it to the
kit", skip this skill and operate on the live VM only.

## Path mapping (memorize this)

| Concept                | Live VM (ephemeral)                                | Kit (persistent)                                                  |
| ---------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| Pi skills              | `~/.pi/agent/skills/<name>/SKILL.md`               | `sandbox/pi/files/home/.pi/agent/skills/<name>/SKILL.md`         |
| Pi installed packages  | `~/.pi/agent/npm/`, `~/.pi/agent/git/`, `~/.pi/agent/settings.json` (`packages: [...]`) | `sandbox/pi/spec.yaml` — append a step to `commands.install`     |

The kit's `sandbox/pi/files/` is overlaid onto the VM's `/` (or onto
`$HOME`, per the `files/home/...` layout) at sandbox creation, so anything
placed there appears at the corresponding live path on every new sandbox.
`commands.install` in `spec.yaml` runs once per fresh sandbox before the
agent starts, so package fetches happen there.

## Add a skill (persistent)

Create the skill as a directory under the kit's skills path, mirroring the
layout the live VM uses:

```
sandbox/pi/files/home/.pi/agent/skills/
└── <skill-name>/
    ├── SKILL.md           # required — frontmatter + body
    └── <helpers>.{sh,js}  # optional — extra files the skill references
```

Steps:

1. Pick a kebab-case skill name. Check for collisions:
   ```bash
   ls sandbox/pi/files/home/.pi/agent/skills/
   ```
2. Create the directory:
   ```bash
   mkdir -p sandbox/pi/files/home/.pi/agent/skills/<skill-name>
   ```
3. Write `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <skill-name>
   description: <one-sentence trigger description, specific enough that an
     LLM will load this skill only when relevant>
   ---

   # <Title>

   ...body...
   ```
4. (Optional) add helper scripts/files alongside `SKILL.md`.
5. Verify the file landed in the kit, not just the VM:
   ```bash
   test -f sandbox/pi/files/home/.pi/agent/skills/<skill-name>/SKILL.md \
     && echo "kit-ok" || echo "MISSING — did you write to ~/.pi by mistake?"
   ```

Do **not** write the skill to `~/.pi/agent/skills/` and call it done —
that location is ephemeral. Always write to the kit path.

## Add an extension (persistent)

Edit `sandbox/pi/spec.yaml` and append a new entry to `commands.install`.
The existing entry installs the `pi` CLI itself; new entries are run
afterwards, in the order listed. Match the existing style.

```yaml
commands:
  install:
    - command: "npm config set proxy $HTTP_PROXY && npm config set https-proxy $HTTP_PROXY && i=0; while [ $i -lt 5 ]; do npm install -g --maxsockets=1 --fetch-timeout=600000 @earendil-works/pi-coding-agent && break; i=$((i+1)); echo \"Retrying ($i/5)...\"; done"
      user: "1000"
      description: "Install pi coding agent globally (with proxy + retries)"
    - command: "i=0; while [ $i -lt 3 ]; do pi install <source-spec> && break; i=$((i+1)); echo \"Retrying ($i/3)...\"; sleep 2; done"
      user: "1000"
      description: "Install <human-readable name> into user settings (~/.pi/agent/)"
```

`<source-spec>` is anything `pi install` accepts:

- `npm:@scope/pkg@1.2.3` — pin a version if you want reproducible kits
- `npm:pkg` — track latest
- `git:github.com/user/repo@v1` — git tag/branch
- `https://...` — raw URL
- `/abs/path` or `./rel/path` — local

The `&& break` inside the while loop means: succeed → done, fail → log and
retry up to N times. The first `install` step retries 5× (it has the
proxy config in front of it); subsequent steps inherit the proxy from
`~/.npmrc` set by step 1 and typically only need 2–3 retries.

Steps:

1. Open `sandbox/pi/spec.yaml`.
2. Append a new `- command:` item to `commands.install` (preserving the
   2-space list indent and 6-space key indent of the existing entries).
3. `user: "1000"` — matches the existing step and ensures the install
   lands in the right home dir.
4. Validate YAML and bash syntax before committing:
   ```bash
   python3 -c "import yaml; yaml.safe_load(open('sandbox/pi/spec.yaml'))"
   # extract the new command and run:
   bash -n -c '<the new command string>'
   ```
5. For the *current* VM, also run the command now so the user does not
   have to recreate the sandbox to test it:
   ```bash
   pi install <source-spec>
   ```
   This is fine — the spec change is what makes it persistent; the
   immediate `pi install` is just for the present session.

## Why this is structured this way

- The kit's `sandbox/pi/files/home/...` is the canonical "lower layer" of
  the VM's overlay. Files there are present on every fresh sandbox before
  the first user command.
- `spec.yaml`'s `commands.install` is the only hook that runs at sandbox
  creation time with network access. It is the only reliable place to
  fetch external packages — putting `pi install` commands in
  `~/.bashrc` or a startup script would race the agent, miss the
  network policy window, and not survive image rebuilds.
- `pi install` is idempotent: re-running it on a VM that already has the
  package is a no-op, so the in-VM `pi install` and the kit's
  `commands.install` step do not fight each other.

## Quick verification

After editing the kit, confirm both halves are wired up:

```bash
# Skill is in the kit (not just the VM)
ls sandbox/pi/files/home/.pi/agent/skills/

# Extension install step is in the kit
grep -A1 "pi install" sandbox/pi/spec.yaml

# In the current VM, both should also be present
ls ~/.pi/agent/skills/
pi list            # shows installed packages from ~/.pi/agent/settings.json
```

If a kit edit does not appear in the current VM, that is expected — the
current VM was built from the previous kit. Recreate the sandbox to pick
up kit changes.
