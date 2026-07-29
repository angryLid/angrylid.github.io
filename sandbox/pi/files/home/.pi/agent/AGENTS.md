# Sandbox environment

You are running inside a Docker sandbox (a microVM). Your workspace is
mounted at its absolute host path — edits you make appear in the host's
working tree as you write them. `sudo` is passwordless; use it for package
installs. Docker is available inside the sandbox; any containers you start
are isolated to the microVM and discarded when the sandbox is removed.

## Provider configuration

A single Anthropic-compatible provider is configured in
`~/.pi/agent/models.json` — Volcengine Ark Coding, hosting `minimax-m3`.
The `apiKey` references the `VOLCENGINE_API_KEY` env var, which the
host-side Docker Sandboxes proxy sets to a `proxy-managed` sentinel and
substitutes with the real key on outbound requests to
`ark.cn-beijing.volces.com`. The real key never enters the VM.

To use a different or additional provider, edit `models.json` and
re-create the sandbox. The kit's `environment.proxyManaged` block in
`spec.yaml` only covers `VOLCENGINE_API_KEY`; for other env-var-named
keys (e.g. `OPENAI_API_KEY`), add them there and to `models.json`.

For self-hosted or non-standard providers that the built-in
`proxyManaged` mechanism doesn't cover, the user must register a custom
credential on the host with `sbx secret set-custom --host <host>
--env MY_KEY --value <key>`, then reference `$MY_KEY` in `models.json`.

## Network access

Outbound traffic is governed by the sandbox network policy (set with
`sbx policy`). The kit allowlists `registry.npmjs.org` (for the npm
install) and `ark.cn-beijing.volces.com` (for the model API). If a
request is blocked, run `sbx policy log` to find the host, then
`sbx policy allow network <host>` to allow it.
