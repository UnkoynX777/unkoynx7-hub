# Tente desativar o hypervisor
try {
    bcdedit /set hypervisorlaunchtype off
    Write-Host "Hypervisor desativado com sucesso."
}
catch {
    Write-Host "Erro ao desativar o hypervisor. Verifique se você tem privilégios administrativos."
}