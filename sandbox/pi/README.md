# Pi coding agent in a Docker Sandbox

A [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/) kit that runs
the [Pi](https://pi.dev/) coding agent inside an isolated microVM.

- `kind: agent` — defines Pi as a top-level agent
- `image: docker/sandbox-templates:shell-docker` — generic Linux base with Docker-in-Docker
- Single Anthropic-compatible provider: Volcengine Ark Coding, model `minimax-m3`
- Real API key lives in the host OS keychain; the sandbox only sees a `proxy-managed` sentinel

## Prerequisites

Install the `sbx` CLI and sign in:

```bash
brew install docker/tap/sbx
sbx login
```

Pick `Balanced` for the default network policy. (Docker Desktop is not
required.)

## One-time setup

Store the Volcengine Ark API key. The kit names the env var
`VOLCENGINE_API_KEY`; the value here is the `ark-...` key from the
Volcengine console.

```bash
sbx secret set -g volcengine
```

The kit's `spec.yaml` declares this service so the proxy knows to
inject the real key into requests to `ark.cn-beijing.volces.com`.

## Run

```bash
cd /path/to/your/project
sbx run --kit <path-to-repo>/sandbox/pi/ pi
```

The first run pulls the kit, installs Pi via `npm install -g`, and drops
you into Pi's TUI. Subsequent runs reuse the sandbox.

Re-attach to the same sandbox later:

```bash
sbx run --name pi-<project> pi
```

Inside Pi, the model picker (`/model`) lists `minimax-m3 (Volcengine Ark
Coding)`. Switch with `/model minimax-m3` or `Ctrl+P` to cycle.

## Configure providers

`files/home/.pi/agent/models.json` is copied to
`/home/agent/.pi/agent/models.json` inside the sandbox on creation.
Edit the file, then recreate the sandbox to pick up changes:

```bash
sbx rm pi-<project>
sbx run --kit <path-to-repo>/sandbox/pi/ --name pi-<project> pi
```

The shipped `models.json` defines a single provider. To add another,
append a `providers.<name>` entry and add the corresponding env var to
both `spec.yaml` (`environment.proxyManaged` for the proxy-managed
pattern) and your `sbx secret set` invocations on the host.

### Adding another built-in provider

For providers on Docker Sandboxes' built-in service list (Anthropic,
OpenAI, Google, etc.):

1. `sbx secret set -g <service>` on the host (e.g. `sbx secret set -g anthropic`)
2. Add the env var to `spec.yaml`'s `environment.proxyManaged`:
   ```yaml
   environment:
     proxyManaged:
       - VOLCENGINE_API_KEY
       - ANTHROPIC_API_KEY
   ```
3. Add a `providers.<name>` entry to `models.json` with the provider's
   `baseUrl`, `api`, and `apiKey: "$<ENV_VAR_NAME>"`

### Adding a self-hosted or non-standard provider

For endpoints outside the built-in list:

```bash
sbx secret set-custom -g \
    --host api.example.com \
    --env MY_PROVIDER_API_KEY \
    --value "$MY_PROVIDER_API_KEY"
```

Then add the provider to `models.json`:

```json
{
  "providers": {
    "my-provider": {
      "baseUrl": "https://api.example.com/v1",
      "api": "anthropic-messages",
      "apiKey": "$MY_PROVIDER_API_KEY",
      "models": [
        { "id": "my-model-1", "name": "My Model 1" }
      ]
    }
  }
}
```

And add `api.example.com` to `spec.yaml`'s `network.allowedDomains`.

## Network policy

The sandbox uses the host's `sbx policy` rules. The kit allowlists the
two domains it needs (`registry.npmjs.org` for the install, the model
API host for inference). If you add providers whose hosts aren't on the
default `Balanced` allowlist, you'll need:

```bash
sbx policy allow network <host>
```

Inspect what's being blocked:

```bash
sbx policy log
```

## Cleanup

```bash
sbx stop pi-<project>   # pause; state preserved
sbx rm   pi-<project>   # destroy; everything inside the VM is deleted
```

`sbx rm` does not touch the host working tree — only the in-VM state.

## Troubleshooting

- `which pi` inside the sandbox: `sbx exec pi-<project> -- which pi`
- Re-run install hooks: `sbx rm pi-<project> && sbx run --kit ... pi`
- Inspect proxy traffic: `sbx policy log pi-<project>`
- Re-validate the kit: `sbx kit validate <path-to-repo>/sandbox/pi/`
- Check that the key reached the proxy: `sbx secret ls`

## Layout

```
sandbox/pi/
├── README.md                            # this file
├── spec.yaml                            # kit definition
└── files/
    └── home/
        └── .pi/
            └── agent/
                ├── AGENTS.md            # memory / sandbox primer
                └── models.json          # provider/model registry
```
