# --- Host Chrome DevTools forwarder (auto-start) ---
# Sourced before every bash command; the SBX_DEVTOOLS_FWD_DONE guard makes
# this idempotent (one TCP probe per shell, spawn only if not listening).
#
# Exposes host Chrome's CDP port (9222) on 127.0.0.1:19222 so the
# chrome-devtools MCP (configured with --browser-url=http://127.0.0.1:19222)
# works. Chrome's DevTools server rejects non-localhost Host headers with a
# 500, so host.docker.internal:9222 can never be used directly —
# --remote-allow-origins=* only relaxes the WebSocket Origin/CORS check.
if [ -z "${SBX_DEVTOOLS_FWD_DONE:-}" ]; then
  export SBX_DEVTOOLS_FWD_DONE=1
  if [ -f "$HOME/.pi/devtools-forward.js" ] && ! (exec 3<>/dev/tcp/127.0.0.1/19222) 2>/dev/null; then
    nohup node "$HOME/.pi/devtools-forward.js" >/dev/null 2>&1 &
  fi
fi
