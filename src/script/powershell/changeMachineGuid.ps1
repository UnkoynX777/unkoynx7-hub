Remove-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Cryptography" -Name "MachineGuid" -Force
Write-Host "MachineGuid alterado com sucesso."