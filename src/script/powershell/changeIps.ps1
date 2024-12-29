netsh int ip reset
netsh interface ipv4 reset
netsh interface ipv6 reset
netsh interface tcp reset

ipconfig /release
ipconfig /renew

ipconfig /flushdns

# Disable and enable network adapters
Get-WmiObject -Query "SELECT * FROM Win32_NetworkAdapter WHERE PhysicalAdapter=True" | ForEach-Object {
    $_.Disable()
    $_.Enable()
}

netsh advfirewall reset
netsh int ipv6 reset
netsh winsock reset