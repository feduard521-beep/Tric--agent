# Actualiza o repo com Postgres + Auth e faz push
# 1) Descarrega Trico-postgres.zip para Downloads
# 2) powershell -ExecutionPolicy Bypass -File .\push-postgres.ps1

$ErrorActionPreference = "Stop"

$zip = @(
  "$env:USERPROFILE\Downloads\Trico-postgres.zip",
  "$env:USERPROFILE\Desktop\Trico-postgres.zip"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $zip) { throw "Coloca Trico-postgres.zip em Downloads." }

$dest = "$env:USERPROFILE\Documents\Tric--agent"
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

$tmp = Join-Path $env:TEMP ("trico-pg-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tmp | Out-Null
Expand-Archive -Path $zip -DestinationPath $tmp -Force
$pkg = Get-ChildItem $tmp -Recurse -Filter package.json | Select-Object -First 1
Copy-Item (Join-Path $pkg.Directory.FullName '*') $dest -Recurse -Force
Remove-Item $tmp -Recurse -Force

Set-Location $dest
if (-not (Test-Path .git)) { git init; git branch -M main }

$remotes = git remote
if ($remotes -notcontains "origin") {
  git remote add origin https://github.com/feduard521-beep/Tric--agent.git
} else {
  git remote set-url origin https://github.com/feduard521-beep/Tric--agent.git
}

git add .
git commit -m "Migrate database to PostgreSQL and enable production auth" 2>$null
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "OK. Agora na Vercel:" -ForegroundColor Green
Write-Host "1) Storage/Neon -> criar Postgres e copiar DATABASE_URL"
Write-Host "2) Env: DATABASE_URL, AUTH_SECRET, AUTH_URL, NEXTAUTH_URL"
Write-Host "3) Redeploy"
Write-Host "4) Abrir https://tric-agent.vercel.app/entrar"
