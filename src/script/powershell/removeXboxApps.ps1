function Remove-UWPApp() {
    [CmdletBinding()]
    param (
        [Parameter(Position = 0, Mandatory)]
        [String[]] $AppxPackages
    )

    Process {
        ForEach ($AppxPackage in $AppxPackages) {
            If (!((Get-AppxPackage -AllUsers -Name "$AppxPackage") -or (Get-AppxProvisionedPackage -Online | Where-Object DisplayName -like "$AppxPackage"))) {
                Write-Host "`"$AppxPackage`" was already removed or not found..."
                Continue
            }

            Write-Host "Removing $AppxPackage from ALL users..."
            Get-AppxPackage -AllUsers -Name "$AppxPackage" | Remove-AppxPackage -AllUsers
            Get-AppxProvisionedPackage -Online | Where-Object DisplayName -like "$AppxPackage" | Remove-AppxProvisionedPackage -Online -AllUsers
        }
    }
}

function Remove-XboxApps() {
    $XboxApps = @(
        "Microsoft.GamingApp"
        "Microsoft.GamingServices"
        "Microsoft.XboxApp"
        "Microsoft.XboxGameCallableUI"
        "Microsoft.XboxGameOverlay"
        "Microsoft.XboxSpeechToTextOverlay"
        "Microsoft.XboxGamingOverlay"
        "Microsoft.XboxIdentityProvider"
        "Microsoft.Xbox.TCUI"
    )

    Write-Host "Removing Xbox Apps..."
    Remove-UWPApp -AppxPackages $XboxApps
}

Remove-XboxApps