FIVEM_APP_DIR = "$env:LOCALAPPDATA\fivem\fivem.app"

if (Test-Path "$FIVEM_APP_DIR\crashes") {
    Remove-Item -Path "$FIVEM_APP_DIR\crashes\*" -Recurse -Force
    Remove-Item -Path "$FIVEM_APP_DIR\crashes" -Recurse -Force
    Write-Host "Cache folder deleted successfully."
} else {
    Write-Host "Cache folder not found."
}

if (Test-Path "$FIVEM_APP_DIR\logs") {
    Remove-Item -Path "$FIVEM_APP_DIR\logs\*" -Recurse -Force
    Remove-Item -Path "$FIVEM_APP_DIR\logs" -Recurse -Force
    Write-Host "Logs folder deleted successfully."
} else {
    Write-Host "Logs folder not found."
}

Write-Host "Deleting DigitalEntitlements folder..."
if (Test-Path "$env:LOCALAPPDATA\DigitalEntitlements") {
    Remove-Item -Path "$env:LOCALAPPDATA\DigitalEntitlements" -Recurse -Force
    Write-Host "DigitalEntitlements folder deleted successfully."
} else {
    Write-Host "DigitalEntitlements folder not found."
}

Write-Host "Deleting kvs folder in Roaming AppData..."
if (Test-Path "$env:APPDATA\CitizenFX\kvs") {
    Remove-Item -Path "$env:APPDATA\CitizenFX\kvs" -Recurse -Force
    Write-Host "CitizenFX folder deleted successfully."
} else {
    Write-Host "kvs folder not found."
}