$Host.UI.RawUI.WindowTitle = "MODO 超合繪配色規劃器"
Write-Host "========================================"
Write-Host "  MODO 超合繪配色規劃器 - 啟動中..."
Write-Host "========================================"
Write-Host ""

Set-Location $PSScriptRoot
$env:Path = "C:\Program Files\nodejs;$env:Path"

$server = Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev","--","-p","3456" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden

Write-Host "等待伺服器啟動..." -NoNewline
do {
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline
    try { $null = Invoke-WebRequest -Uri "http://localhost:3456" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; $ready = $true } catch { $ready = $false }
} until ($ready)

Write-Host ""
Write-Host "伺服器已啟動！正在開啟應用程式..."

$edgePaths = @(
    (Get-Command msedge -ErrorAction SilentlyContinue).Source,
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$chromePaths = @(
    (Get-Command chrome -ErrorAction SilentlyContinue).Source,
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

$launched = $false
foreach ($p in ($edgePaths + $chromePaths)) {
    if ($p -and (Test-Path $p)) {
        Start-Process -FilePath $p -ArgumentList "--app=http://localhost:3456","--window-size=1280,900"
        $launched = $true
        break
    }
}
if (-not $launched) { Start-Process "http://localhost:3456" }

Write-Host ""
Write-Host "========================================"
Write-Host "  應用程式已啟動！"
Write-Host "  按任意鍵停止伺服器並關閉"
Write-Host "========================================"
Write-Host ""
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
