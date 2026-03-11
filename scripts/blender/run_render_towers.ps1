# Run Blender in background to render tower sprites.
# If "blender" is not in PATH, this script finds Blender on Windows or uses $env:BLENDER_EXE.

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot
$pyScript = Join-Path $scriptDir "render_tower_sprites.py"

if (-not (Test-Path $pyScript)) {
    Write-Error "Script not found: $pyScript"
}

$blenderExe = $null

if ($env:BLENDER_EXE -and (Test-Path $env:BLENDER_EXE)) {
    $blenderExe = $env:BLENDER_EXE
} else {
    $found = Get-Command blender -ErrorAction SilentlyContinue
    if ($found) {
        $blenderExe = $found.Source
    }
}

if (-not $blenderExe) {
    $base = "C:\Program Files\Blender Foundation"
    if (Test-Path $base) {
        $dirs = Get-ChildItem -Path $base -Directory -ErrorAction SilentlyContinue
        foreach ($d in $dirs) {
            $exe = Join-Path $d.FullName "blender.exe"
            if (Test-Path $exe) {
                $blenderExe = $exe
                break
            }
        }
    }
}

if (-not $blenderExe) {
    Write-Host "Blender not found. Do one of the following:"
    Write-Host "  1. Add Blender to your PATH, or"
    Write-Host "  2. Set environment variable: `$env:BLENDER_EXE = 'C:\Program Files\Blender Foundation\Blender 4.2\blender.exe'"
    Write-Host "     (adjust path to your Blender version)"
    exit 1
}

Write-Host "Using Blender: $blenderExe"
& $blenderExe --background --python $pyScript
