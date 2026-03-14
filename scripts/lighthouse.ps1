$rootDir = Split-Path -Parent $PSScriptRoot

# cmd.exe inherits the full system PATH (fnm/nvm included), unlike Start-Job
$serveProc = Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c cd /d `"$rootDir`" && pnpm run serve" `
  -WindowStyle Hidden -PassThru

Write-Host "Waiting for port 3000..."
$timeout = 60
$elapsed = 0
$ready = $false

while ($elapsed -lt $timeout) {
  Start-Sleep -Seconds 1
  $elapsed++
  try {
    $tcp = New-Object Net.Sockets.TcpClient
    $tcp.Connect("127.0.0.1", 3000)
    $tcp.Close()
    $ready = $true
    break
  } catch {}
}

if (-not $ready) {
  Write-Error "Server did not start within $timeout seconds"
  taskkill /F /PID $serveProc.Id /T 2>$null | Out-Null
  exit 1
}

Write-Host "Server ready. Running Lighthouse..."
Set-Location $rootDir
pnpm run lighthouse:run
$lhExit = $LASTEXITCODE

taskkill /F /PID $serveProc.Id /T 2>$null | Out-Null
Write-Host "Server stopped."
exit $lhExit
