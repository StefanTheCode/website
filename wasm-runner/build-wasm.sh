#!/usr/bin/env bash
#
# Builds the in-browser .NET WASM C# runner and copies the runtime into
# ../public/dotnet/ so the website's /playground (and inline runnable code
# blocks) can compile & run C# entirely client-side.
#
# Run once (and re-run whenever you change Program.cs):
#   cd wasm-runner && ./build-wasm.sh
#
# Then commit the generated public/dotnet/ folder.

set -euo pipefail
cd "$(dirname "$0")"

echo "→ Ensuring wasm-tools workload is installed…"
dotnet workload install wasm-tools

echo "→ Publishing Runner (browser-wasm, Release)…"
dotnet publish -c Release

# The published browser-wasm app bundle holds dotnet.js + _framework/*.
APPBUNDLE="$(find bin/Release -type d -name AppBundle | head -1)"
if [ -z "${APPBUNDLE}" ]; then
  echo "✗ Could not find the AppBundle output. Check the publish logs above." >&2
  exit 1
fi

DEST="../public/dotnet"
echo "→ Copying runtime from ${APPBUNDLE} to ${DEST}…"
rm -rf "${DEST}"
mkdir -p "${DEST}"
cp -R "${APPBUNDLE}/." "${DEST}/"

echo "✓ Done. /dotnet/dotnet.js is now available — the playground Run button will work."
echo "  Remember to commit ${DEST}."
