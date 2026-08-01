---
name: sandbox-persistence
description: Persistently store new pi skills and pi packages (extensions) in the kit so they survive sandbox recreation. Use when creating a new skill (write the skill to sandbox/pi/files/home/.pi/agent/skills/) or when installing a pi extension (add it to sandbox/pi/files/home/.pi/agent/settings.json packages[]). This sandbox uses an overlay filesystem — anything written to ~/.pi/ inside the running VM is lost when the sandbox is recreated, so persistent assets must be baked into the kit instead.
---

# Sandbox Persistence

This kit (`sandbox/pi/`) is the source of truth for everything that should
exist in a freshly created sandbox. The running VM is an **overlay** on top
of the kit: writes inside the VM persist for the life of that one VM and
are discarded on recreation. Two kinds of assets must therefore be added
to the kit, not the live VM, in order to be **persistent**:

1. **Pi skills** — new `SKILL.md` files
2. **Pi packages / extensions** — entries in `settings.json` → `packages[]`

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
| Pi installed packages  | `~/.pi/agent/npm/`, `~/.pi/agent/git/`, `~/.pi/agent/settings.json` (`packages: [...]`) | `sandbox/pi/files/home/.pi/agent/settings.json` (add the source string to the existing `packages: []` array) |
| MCP server config      | `~/.pi/agent/mcp.json`                             | `sandbox/pi/files/home/.pi/agent/mcp.json`                       |

The kit's `sandbox/pi/files/home/...` is overlaid onto `$HOME` at sandbox
creation, so anything placed there appears at the corresponding live path
on every new sandbox — before any agent command runs, and without
needing a network round-trip.

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

## Add MCP server config (persistent)

MCP servers are configured via `~/.pi/agent/mcp.json` (Pi-global layer).
The `pi-mcp-adapter` package reads this file on startup and exposes the
servers as tools to the LLM.

Steps:

1. Write `mcp.json` to the kit path:
   ```bash
   mkdir -p sandbox/pi/files/home/.pi/agent
   ```
2. Structure follows the standard MCP config format:
   ```json
   {
     "mcpServers": {
       "server-name": {
         "command": "npx",
         "args": ["-y", "some-mcp-server@latest"]
       }
     }
   }
   ```
3. For servers that need to reach a host-side service (e.g. Chrome DevTools
   with `--remote-debugging-port`), **do NOT point directly at
   `host.docker.internal`** — Chrome's DevTools server rejects non-localhost
   `Host` headers (500 `Host header is specified and is not an IP address or
   localhost`). `--remote-allow-origins=*` does NOT relax that check (it only
   affects the WebSocket Origin/CORS check). Instead, use a launcher script as
   the server's `command` that starts the kit's TCP forwarder as a
   precondition, then execs the real server pointed at `127.0.0.1:19222`
   (Chrome accepts it because the Host header it sees is `localhost`):
   ```json
   {
     "mcpServers": {
       "chrome-devtools": {
         "command": "/home/agent/.pi/start-chrome-devtools-mcp.sh",
         "args": []
       }
     }
   }
   ```
   The launcher (`sandbox/pi/files/home/.pi/start-chrome-devtools-mcp.sh`)
   probes 127.0.0.1:19222, starts the zero-dep Node `net` pipe
   (`sandbox/pi/files/home/.pi/devtools-forward.js`, 19222 →
   `host.docker.internal:9222`) with `setsid` if nothing is listening, then
   `exec`s `chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:19222`.
   Making the forwarder a launch precondition (rather than a background
   daemon) keeps the whole solution self-contained in `mcp.json`.
4. Validate JSON:
   ```bash
   python3 -c "import json; json.load(open('sandbox/pi/files/home/.pi/agent/mcp.json'))"
   ```

> **Note:** The `pi-mcp-adapter` package itself must still be registered in
> `settings.json → packages[]` (see previous section). The `mcp.json` file
> only configures *which* MCP servers are available; the adapter is what
> loads them.

## Add an extension (persistent)

Edit `sandbox/pi/files/home/.pi/agent/settings.json` and append the
package's source string to the existing `packages` array:

```json
{
  "defaultProjectTrust": "always",
  "packages": ["npm:pi-mcp-adapter", "<new-source-spec>"]
}
```

`<source-spec>` is the same string you would pass to `pi install`:

- `npm:@scope/pkg@1.2.3` — pin a version for a reproducible kit
- `npm:pkg` — track latest
- `git:github.com/user/repo@v1` — git tag/branch
- `https://...` — raw URL
- `/abs/path` or `./rel/path` — local

Steps:

1. Open `sandbox/pi/files/home/.pi/agent/settings.json`.
2. Append the source spec to the `packages` array (preserving the
   2-space indent and trailing comma before the new entry if needed).
3. Validate JSON before committing:
   ```bash
   python3 -c "import json; json.load(open('sandbox/pi/files/home/.pi/agent/settings.json'))"
   ```
4. For the *current* VM, also install the package now so the user does
   not have to recreate the sandbox to use it:
   ```bash
   pi install <source-spec>
   ```
   This is fine — the kit change is what makes the install persistent;
   the immediate `pi install` is just for the present session.

## Why this is structured this way

- The kit's `sandbox/pi/files/home/...` is the canonical "lower layer" of
  the VM's overlay. Files there are present on every fresh sandbox before
  the first user command — **no install step, no network, no TTY required**.
- Earlier versions of this kit used `spec.yaml → commands.install` to run
  `pi install` at sandbox creation. That approach is fragile: the install
  step needs a TTY (or non-interactive approval), needs network access
  during the install window, and races the kit overlay. Editing
  `settings.json` directly side-steps all three.
- The `commands.install` hook is still used for the `pi` CLI itself, where
  we genuinely need to fetch a binary from the network — there is no
  pre-baked equivalent. New extension installs do **not** belong there.
- The only catch: editing `settings.json` records the package but does
  **not** fetch its files into `~/.pi/agent/npm/` (or `git/`). On a fresh
  sandbox, the first `pi install <source>` (or a `/reload`) will populate
  the directory. The kit ships the *registration* persistently; the
  *files* are filled in lazily on first use.

## Quick verification

After editing the kit, confirm both halves are wired up:

```bash
# Skill is in the kit (not just the VM)
ls sandbox/pi/files/home/.pi/agent/skills/

# Extension registration is in the kit
cat sandbox/pi/files/home/.pi/agent/settings.json

# In the current VM, both should also be present
ls ~/.pi/agent/skills/
pi list            # shows installed packages from ~/.pi/agent/settings.json
```

If a kit edit does not appear in the current VM, that is expected — the
current VM was built from the previous kit. Recreate the sandbox to pick
up kit changes.
