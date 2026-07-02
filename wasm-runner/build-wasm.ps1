<#
    build-wasm.ps1 — Windows build for the in-browser C# runner.

    Compiles this .NET project to WebAssembly and copies the runtime into
    ..\public\dotnet\ so the website's /playground page and the inline "Run"
    buttons in the web reader can compile & execute C# entirely client-side.

    Run once (and re-run whenever you change Program.cs):
        cd wasm-runner
        .\build-wasm.ps1

    Then commit the generated public\dotnet\ folder and deploy.

    Requires: .NET 8 SDK (dotnet --version -> 8.x). The script installs the
    wasm-tools workload for you.
#>

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

# --- sanity: dotnet present? ---
$dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnet) {
    Write-Error "dotnet SDK not found on PATH. Install the .NET 8 SDK, then re-run."
    exit 1
}
Write-Host "-> dotnet $((dotnet --version).Trim()) detected"

# --- ensure the wasm-tools workload (needed for browser-wasm publish) ---
Write-Host "-> Ensuring wasm-tools workload is installed..."
dotnet workload install wasm-tools

# --- publish to browser-wasm (Release) ---
Write-Host "-> Publishing Runner (browser-wasm, Release)..."
dotnet publish -c Release

# --- locate the published AppBundle (holds dotnet.js + _framework\*) ---
$appBundle = Get-ChildItem -Path "bin\Release" -Directory -Recurse -Filter "AppBundle" |
    Select-Object -First 1
if (-not $appBundle) {
    Write-Error "Could not find the AppBundle output under bin\Release. Check the publish logs above."
    exit 1
}

# --- copy runtime into ..\public\dotnet\ (replace any previous build) ---
$dest = Join-Path $PSScriptRoot "..\public\dotnet"
Write-Host "-> Copying runtime from $($appBundle.FullName) to $dest ..."
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path (Join-Path $appBundle.FullName "*") -Destination $dest -Recurse -Force

Write-Host ""
Write-Host "Done. /dotnet/dotnet.js is now available." -ForegroundColor Green
Write-Host "  -> Commit public\dotnet\ and deploy; the /playground Run button goes live."
