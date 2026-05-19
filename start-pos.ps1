# ==============================
# AUTO-MINIMIZE THIS WINDOW
# ==============================
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class Win {
    [DllImport("kernel32.dll")]
    public static extern IntPtr GetConsoleWindow();

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

$consolePtr = [Win]::GetConsoleWindow()
[Win]::ShowWindow($consolePtr, 2)

# ==============================
# PATHS
# ==============================
$backendPath = "C:\Users\Admin\TEL AVIV MINI SUPERMARKET 2\TEL AVIV MINI SUPERMARKET 2\possystem"
$frontendPath = "C:\Users\Admin\TEL AVIV MINI SUPERMARKET 2\TEL AVIV MINI SUPERMARKET 2\frontend"

$backendPort = 8080
$frontendPort = 5173

# ==============================
# FUNCTION: CHECK PORT
# ==============================
function Test-Port {
    param($port)

    try {
        $client = New-Object System.Net.Sockets.TcpClient("localhost", $port)
        $client.Close()
        return $true
    }
    catch {
        return $false
    }
}

# ==============================
# CLEAN OLD PORT PROCESSES
# ==============================

# Kill backend port
$backendPID = netstat -ano | findstr ":$backendPort" | ForEach-Object {
    ($_ -split "\s+")[-1]
} | Select-Object -Unique

foreach ($pid in $backendPID) {
    taskkill /F /PID $pid 2>$null | Out-Null
}

# Kill frontend port
$frontendPID = netstat -ano | findstr ":$frontendPort" | ForEach-Object {
    ($_ -split "\s+")[-1]
} | Select-Object -Unique

foreach ($pid in $frontendPID) {
    taskkill /F /PID $pid 2>$null | Out-Null
}

Start-Sleep -Seconds 3

# ==============================
# START BACKEND (HIDDEN)
# ==============================

Start-Process powershell.exe `
    -WindowStyle Hidden `
    -ArgumentList "-NoProfile -WindowStyle Hidden -Command `"cd '$backendPath'; mvn spring-boot:run`""

# ==============================
# WAIT FOR BACKEND
# ==============================

do {
    Start-Sleep -Seconds 2
} until (Test-Port $backendPort)

# ==============================
# START FRONTEND (HIDDEN)
# ==============================

Start-Process powershell.exe `
    -WindowStyle Hidden `
    -ArgumentList "-NoProfile -WindowStyle Hidden -Command `"cd '$frontendPath'; npm run dev -- --port 5173 --strictPort`""

# ==============================
# WAIT FOR FRONTEND
# ==============================

do {
    Start-Sleep -Seconds 2
} until (Test-Port $frontendPort)

# ==============================
# OPEN BROWSER
# ==============================

Start-Sleep -Seconds 2
Start-Process "http://localhost:$frontendPort"