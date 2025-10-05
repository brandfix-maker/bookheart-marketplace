# BookHeart Marketplace - Environment Setup Script
# This script creates a .env.local file with the required configuration

Write-Host "BookHeart Marketplace - Environment Setup" -ForegroundColor Magenta
Write-Host "============================================================"
Write-Host ""

$envPath = Join-Path $PSScriptRoot ".env.local"

if (Test-Path $envPath) {
    Write-Host "WARNING: .env.local already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Cancelled. Existing file preserved." -ForegroundColor Red
        exit 1
    }
}

$envContent = @"
DATABASE_URL=postgresql://neondb_owner:npg_3tdLMilC5fOh@ep-crimson-paper-adanhigf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=sCljfH8BaAn3EWnUdk9vzc7asyDCTIgz
JWT_REFRESH_SECRET=RT5wG0IOTpT0DBkbl7qKWEfJ7Txv2Pqx
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@

try {
    $envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline
    Write-Host "SUCCESS: Created .env.local file!" -ForegroundColor Green
    Write-Host ""
    Write-Host "File contents:" -ForegroundColor Cyan
    Write-Host $envContent -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Green
    Write-Host "1. Run: npm install" -ForegroundColor White
    Write-Host "2. Run: npm run dev" -ForegroundColor White
    Write-Host "3. Visit: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "The connection error should now be fixed!" -ForegroundColor Magenta
} catch {
    Write-Host "ERROR: Could not create .env.local file: $_" -ForegroundColor Red
    exit 1
}
