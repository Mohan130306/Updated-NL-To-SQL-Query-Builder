$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "Setting up backend..."
$pythonExe = Join-Path $backendPath "venv/Scripts/python.exe"
if (-not (Test-Path $pythonExe)) {
    & python -m venv (Join-Path $backendPath "venv")
}

$env:DATABASE_URL = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "sqlite:///./local.db" }
$env:SECRET_KEY = if ($env:SECRET_KEY) { $env:SECRET_KEY } else { "dev-secret-key-change-me" }
$env:GEMINI_API_KEY = if ($env:GEMINI_API_KEY) { $env:GEMINI_API_KEY } else { "" }
$env:PYTHONPATH = $backendPath

& $pythonExe -m pip install -r (Join-Path $backendPath "requirements.txt")
Write-Host "Seeding database..."
& $pythonExe -m app.db.init_db
Write-Host "Starting FastAPI server in the background..."
Start-Process -NoNewWindow -FilePath $pythonExe -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -WorkingDirectory $backendPath

Write-Host "Setting up frontend..."
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $nodeCmd -or -not $npmCmd) {
    throw "Node.js and npm are required to run the frontend. Please install them first."
}

Set-Location $frontendPath
npm install
Write-Host "Starting React app..."
npm run dev -- --host 127.0.0.1
