$processes = @(
    "Fivem",
    "Steam", 
    "EpicGamesLauncher",
    "Launcher",
    "SocialClubHelper",
    "RockstarService",
    "LauncherPatcher",
    "smartscreen",
    "EasyAntiCheat",
    "dnf",
    "DNF",
    "CrossProxy",
    "tensafe_1",
    "TenSafe_1",
    "tensafe_2",
    "tencentdl",
    "TenioDL",
    "uishell",
    "BackgroundDownloader",
    "conime",
    "QQDL",
    "qqlogin",
    "dnfchina",
    "dnfchinatest",
    "dnf",
    "txplatform",
    "TXPlatform",
    "OriginWebHelperService",
    "Origin",
    "OriginClientService",
    "OriginER",
    "OriginThinSetupInternal",
    "OriginLegacyCLI",
    "Agent",
    "Client"
)

# Listar todos os processos em execução
Get-Process | Select-Object -Property Name

foreach ($process in $processes) {
    try {
        # Verificar se o processo está em execução antes de tentar parar
        if (Get-Process -Name $process -ErrorAction SilentlyContinue) {
            Stop-Process -Name $process -Force -ErrorAction Stop
            Write-Host "Processo $process encerrado com sucesso."
        } else {
            Write-Host "Processo $process não está em execução."
        }
    } catch {
        Write-Host "Não foi possível encerrar o processo $process. Pode não estar em execução ou ocorreu um erro."
    }
}