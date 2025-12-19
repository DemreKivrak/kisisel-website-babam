# Simple Deployment Script
Write-Host "Starting deployment preparation..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Frontend built successfully" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Step 2: Copy dist to backend/public
Write-Host "Copying dist to backend/public..." -ForegroundColor Yellow
if (Test-Path "backend\public") {
    Remove-Item -Path "backend\public" -Recurse -Force
}
Copy-Item -Path "frontend\dist" -Destination "backend\public" -Recurse
Write-Host "✓ Dist copied to backend/public" -ForegroundColor Green
Write-Host ""

# Step 3: Create ZIP
Write-Host "Creating deployment.zip..." -ForegroundColor Yellow
Set-Location backend

$zipPath = "deployment.zip"
if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
}

# Files to include
$filesToZip = @(
    "index.js",
    "package.json",
    "package-lock.json",
    "Procfile",
    "public"
)

# Create temporary folder
$tempFolder = "temp-zip"
if (Test-Path $tempFolder) {
    Remove-Item -Path $tempFolder -Recurse -Force
}
New-Item -Path $tempFolder -ItemType Directory | Out-Null

# Copy files to temp folder
foreach ($file in $filesToZip) {
    if (Test-Path $file) {
        if (Test-Path $file -PathType Container) {
            Copy-Item -Path $file -Destination "$tempFolder\$file" -Recurse
        } else {
            Copy-Item -Path $file -Destination "$tempFolder\$file"
        }
    }
}

# Create ZIP
Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Cleanup temp folder
Remove-Item -Path $tempFolder -Recurse -Force

$zipSize = (Get-Item $zipPath).Length / 1MB
$zipSizeRounded = [math]::Round($zipSize, 2)
Write-Host "deployment.zip created ($zipSizeRounded MB)" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "File location: backend\deployment.zip" -ForegroundColor White
Write-Host ""
