trap {"An error trapped..."}

$Authorization = @"
using System;
using System.Runtime.InteropServices;

public class AdjProcessPriv
{
[DllImport("kernel32.dll")]
public static extern uint WTSGetActiveConsoleSessionId();
[DllImport("Wtsapi32.dll", SetLastError = true)]
public static extern uint WTSQueryUserToken(uint SessionId, ref IntPtr phToken);
[DllImport("advapi32.dll", SetLastError = true)]
public static extern uint ImpersonateLoggedOnUser(IntPtr hToken);
[DllImport("advapi32.dll", EntryPoint = "CreateProcessAsUser", SetLastError = true, CharSet = CharSet.Ansi, CallingConvention = CallingConvention.StdCall)]
public static extern bool CreateProcessAsUser(IntPtr hToken, String lpApplicationName, String lpCommandLine, IntPtr lpProcessAttributes,
IntPtr lpThreadAttributes, bool bInheritHandle, uint dwCreationFlags, IntPtr lpEnvironment, String lpCurrentDirectory, 
ref STARTUPINFO lpStartupInfo, out PROCESS_INFORMATION lpProcessInformation);

[DllImport("userenv.dll", SetLastError = true)]
public static extern bool CreateEnvironmentBlock(ref IntPtr lpEnvironment, IntPtr hToken, bool bInherit);
[DllImport("userenv.dll", SetLastError = true)]
[return: MarshalAs(UnmanagedType.Bool)]
public static extern bool DestroyEnvironmentBlock(IntPtr lpEnvironment);

[DllImport("kernel32.dll", SetLastError = true)]
public static extern bool CloseHandle(IntPtr hSnapshot);

[DllImport("kernel32.dll", SetLastError = true)]
public static extern uint WaitForSingleObject(IntPtr hHandle, uint dwMilliseconds);

[DllImport("shell32.dll")]
public static extern IntPtr ShellExecute(
IntPtr hwnd,
string lpszOp,
string lpszFile,
string lpszParams,
string lpszDir,
int FsShowCmd
);

public enum WTS_CONNECTSTATE_CLASS
{
    WTSActive,
    WTSConnected,
    WTSConnectQuery,
    WTSShadow,
    WTSDisconnected,
    WTSIdle,
    WTSListen,
    WTSReset,
    WTSDown,
    WTSInit
}
[StructLayout(LayoutKind.Sequential)]
public struct PROCESS_INFORMATION
{
    public IntPtr hProcess;
    public IntPtr hThread;
    public uint dwProcessId;
    public uint dwThreadId;
}
[StructLayout(LayoutKind.Sequential)]
public struct STARTUPINFO
{
    public int cb;
    public String lpReserved;
    public String lpDesktop;
    public String lpTitle;
    public uint dwX;
    public uint dwY;
    public uint dwXSize;
    public uint dwYSize;
    public uint dwXCountChars;
    public uint dwYCountChars;
    public uint dwFillAttribute;
    public uint dwFlags;
    public short wShowWindow;
    public short cbReserved2;
    public IntPtr lpReserved2;
    public IntPtr hStdInput;
    public IntPtr hStdOutput;
    public IntPtr hStdError;
}

public static uint LaunchUserProcess(string appPath, string cmdLine)
{
    uint processId = 0;
    var hImpersonationToken = IntPtr.Zero;
    uint activeSessionId = WTSGetActiveConsoleSessionId();
    uint userToken = WTSQueryUserToken(activeSessionId, ref hImpersonationToken);
    if (userToken != 0)
    {
        if (ImpersonateLoggedOnUser(hImpersonationToken) != 0)
		{
            var startInfo = new STARTUPINFO();
            var procInfo = new PROCESS_INFORMATION();
            var pEnv = IntPtr.Zero;
            startInfo.cb = Marshal.SizeOf(typeof(STARTUPINFO));
            CreateEnvironmentBlock(ref pEnv, hImpersonationToken, false);
            if (CreateProcessAsUser(hImpersonationToken,
                    appPath,    
                    cmdLine,    
                    IntPtr.Zero,
                    IntPtr.Zero,
                    false,
                    0,
                    IntPtr.Zero,
                    null,    
                    ref startInfo,
                    out procInfo))
                {                   
                    processId = procInfo.dwProcessId;
                    WaitForSingleObject(procInfo.hProcess, 5000);
                }

                if (pEnv != IntPtr.Zero)
                {
                    DestroyEnvironmentBlock(pEnv);
                }
                CloseHandle(procInfo.hThread);
                CloseHandle(procInfo.hProcess);

        }   
        CloseHandle(hImpersonationToken);
    }
    if(processId == 0)
    {
        var shellInfo = ShellExecute(IntPtr.Zero, "", appPath, cmdLine, null, 0);
        if(shellInfo.ToInt32() > 32)
        {
            processId = (uint)(shellInfo.ToInt32());
        }
    }
    return processId;
}

}
"@ 
$type = Add-Type $Authorization  -passthru

# ::***********************************************************************************************
# :: Definition-1: Check bitness of OS, process, package, guid of old version
# ::***********************************************************************************************
$OS_BITNESS=32
if([Environment]::Is64BitOperatingSystem -eq $True) {
$OS_BITNESS=64
}

$PS_BITNESS=32
if([Environment]::Is64BitProcess -eq $True) {
$PS_BITNESS=64
}

$PK_BITNESS=32
if(($PSScriptRoot.ToLower().Contains("x64".ToLower())) -eq $True) {
$PK_BITNESS=64
}

$arch="x86"
if ($OS_BITNESS -eq 64) {
$arch="x64"
}

$PRODCODE64="{CBEDEC16-C4F5-4255-99E4-5884EFEDD1BC}"
$PRODCODE32="{01DBFF2E-73FD-4CC3-98CE-B39260D80D8C}"
$PRODCODE64_OLD="{B8D3ED8D-A295-44C2-8AE1-56823D44AD1F}"
$PRODCODE32_OLD="{840DE7EE-4816-4402-BEE4-80517B3233A3}"


# ::***********************************************************************************************
# :: Definition-2: common variables and functions
# ::***********************************************************************************************
$PackageName = "LenovoBatteryGaugePackage"
$PathPackageDirDest = "$env:ProgramData\Lenovo\ImController\Plugins\LenovoBatteryGaugePackage"
$PathPackageDirSource = "$env:ProgramData\Lenovo\ImController\Plugins\LenovoBatteryGaugePackage_"

# ::***********************************************************************************************
# :: Definition: Write-Log
$LogFileName = ("$PackageName" + ".Install." + (Get-Date -Format "-yyyy_MM_dd-HH-mm-ss") + ".txt")
$PathLogFile = "$env:ProgramData\Lenovo\Modern\Logs\$LogFileName"

[bool]$EnableLogging = $false
try { $EnableLogging = ((Get-ItemPropertyValue -Path "HKLM:\SOFTWARE\Wow6432Node\Lenovo\Modern\Logs" -Name "ImController.Service") -eq 0 ) } catch{}

if($EnableLogging -and ( -not(Test-Path $PathLogFile))) {
	New-Item -Path (Split-Path $PathLogFile) -Name (Split-Path $PathLogFile -leaf) -ItemType File -force
}

$PSDefaultParameterValues["Write-Log:pathToLogFile"]=$PathLogFile
$PSDefaultParameterValues["Write-Log:enableLogging"]=$EnableLogging

Function Write-Log
{
    [CmdletBinding()]
    param(
		[Parameter(
			Mandatory=$false,
			Position=1,
			ValueFromPipeline=$true
		)]
		[PSObject[]]$inputObject,
        [string]$pathToLogFile=".\" + [System.IO.Path]::GetFileName($MyInvocation.ScriptName) + ".log",
		[bool]$enableLogging=$true
    )

    $obj=$null
    if($input -ne $null)
    {
        $obj=$input
    }
    else
    {
        $obj=$inputObject
    }

    Out-Host -InputObject $obj
    if($enableLogging)
    {
		$timeStamp = $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss  ')
		$objTS = $timeStamp + $obj

	  	Out-File -InputObject $objTS -FilePath $pathToLogFile -Encoding unicode -Append -Width 200
    }
}

Function PrintDestPackageDetails
{
	if($EnableLogging)
	{
		if(Test-Path "$PathPackageDirDest\$arch")
		{
			Get-ChildItem -Path "$PathPackageDirDest\$arch" | Select-Object Name, LastWriteTime, Length | Out-File  $PathLogFile -Encoding unicode -Append
		}
		else
		{
			Write-Log "The dest package dir does not exist($PathPackageDirDest\$arch)"
		}
	}
}


Function UninstallMsi($prodCode)
{
	$uninstallString = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\$prodCode" -Name "UninstallString" -ErrorAction SilentlyContinue).UninstallString
	if (($UninstallString -ne $null) -and ($uninstallString.Length -ne 0)) {
		Write-Log "start uninstall msi package for PRODCODE $prodCode"
		$MSIEXECPATH = "$env:SystemRoot\System32\MsiExec.exe"
		Write-Log "Start-Process -NoNewWindow -Wait -FilePath $MSIEXECPATH `"/X$prodCode /quiet /noreboot`""
		Start-Process -NoNewWindow -Wait -FilePath $MSIEXECPATH "/X$prodCode /quiet /noreboot" *>&1 | Write-Log
	}
	else
	{
		Write-Log "cannot find uninstall entry for program PRODCODE $prodCode"
	}
}

Function GetCurrentActiveUserSID
{
	$activeUser = Get-WmiObject Win32_ComputerSystem -ComputerName $env:computername -EA stop | Select UserName -Unique|%{"{0}" -f $_.UserName.ToString().Split('\')[1]}
	$objUser = New-Object System.Security.Principal.NTAccount("$activeUser")
	$strSID = $objUser.Translate([System.Security.Principal.SecurityIdentifier])
	$strSID.Value
}

# ::***********************************************************************************************
# :: Definition: BatteryGaugeIconControl
$applicationName = "$env:SystemRoot\system32\rundll32.exe"
$ShowBg = "ShowBatteryGauge"
$HideBg = "HideBatteryGauge"
$UnloadBg = "UnloadBatteryGaugeFromExplorer"
$InstallFileName = "Install.ps1"
$UninstallFileName = "Uninstall.ps1"

Function BatteryGaugeIconControl($commandName)
{
	#Param(
	#	[string]$commandName,
	#	[bool]$impersonnateLoggedOnUser = $True
	#)

	# Execute from dest dir
	$pathCmdFile = "$PathPackageDirDest\$arch\$commandName.lnk"
	$pathDllFile = "$PathPackageDirDest\$arch\LenovoBatteryGaugePackage.dll"
	if((-not(Test-Path -Path "$pathDllFile" -PathType Leaf)) -or (-not(Test-Path -Path "$pathCmdFile" -PathType Leaf)))
	{
		# Execute from source dir
		$pathCmdFile = "$PathPackageDirSource\$arch\$commandName.lnk"
		$pathDllFile = "$PathPackageDirSource\$arch\LenovoBatteryGaugePackage.dll"
	}

	if((Test-Path -Path "$pathDllFile" -PathType Leaf) -and (Test-Path -Path "$pathCmdFile" -PathType Leaf))
	{
		# IMPORT: the 'blank space' MUST reserve!!!
		$commandParam = " $pathDllFile, " + $commandName
		
		$processId = $type[0]::LaunchUserProcess($applicationName, $commandParam)
		
		$LaunchSuccess = $($processId -ne 0)
		Write-Log "BatteryGaugeIconControl($commandName): LaunchSuccess=[ $LaunchSuccess ], PID=[ $processId ]"		
		return $processId
	}
	else
	{
		Write-Log "BatteryGaugeIconControl($commandName) failed! FILE NOT FOUND: $pathDllFile"
		return 0
	}
}

# ::***********************************************************************************************
# :: Definition: expand shortcut file
$PathShortCutDir = "$PSScriptRoot\.."
if( -not(Test-Path $PathShortCutDir) ) {
	$PathShortCutDir = $PathPackageDirDest
	if($true -eq ((($PSCommandPath).ToUpper()).Contains("LENOVOBATTERYGAUGEPACKAGE_"))){
		$PathShortCutDir = $PathPackageDirSource
	}
}

Function Expand-EnvironmentVariablesForLnkFile
{
    param([string]$modulePlatform, [string]$moduleFunction)

	if( -not(Test-Path "$PathShortCutDir\$modulePlatform") ) {
		return
	}

    $shortCutFile = "$PathShortCutDir\$modulePlatform\$moduleFunction" + ".lnk"
	$argumentsList = "$PathPackageDirDest\$modulePlatform\LenovoBatteryGaugePackage.dll," + $moduleFunction
	$workingDir = "$PathPackageDirDest\$modulePlatform\"

    $wScriptShell = New-Object -ComObject WScript.Shell 
    $shortCut = $wScriptShell.CreateShortcut($shortCutFile) 
    $shortCut.TargetPath = [Environment]::ExpandEnvironmentVariables($applicationName)
    $shortCut.Arguments = [Environment]::ExpandEnvironmentVariables($argumentsList)
    $shortCut.WorkingDirectory = [Environment]::ExpandEnvironmentVariables($workingDir)
    $shortCut.Save() 
}

Function Expand-EnvironmentVariablesForLnkFileEx
{
	param([string]$moduleFunction)

	Expand-EnvironmentVariablesForLnkFile "x86" $moduleFunction
	Expand-EnvironmentVariablesForLnkFile "x64" $moduleFunction
}

Function StopProcessByTaskkill
{
	# Compatibale old version: stop process activated by BatteryGauge(using taskkill.exe)
	Write-Log "Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList `"/F /T /IM QuickSetting.exe`""
	Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList "/F /T /IM QuickSetting.exe" *>&1 | Write-Log

	Write-Log "Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList `"/F /T /IM QuickSettingEx.exe`""
	Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList "/F /T /IM QuickSettingEx.exe" *>&1 | Write-Log

	Write-Log "Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList `"/F /T /IM HeartbeatMetrics.exe`""
	Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList "/F /T /IM HeartbeatMetrics.exe" *>&1 | Write-Log

	Write-Log "Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList `"/F /T /IM SetThinkTouchPad.exe`""
	Start-Process -NoNewWindow -Wait -FilePath taskkill.exe -ArgumentList "/F /T /IM SetThinkTouchPad.exe" *>&1 | Write-Log
}


# BG should be excluded when device satisfies: {China + Lenovo/Idea brand + PCManager installed}
Function BatteryGaugeShouldBeExclude
{
    $IsExclude = $False

    $miVantagePath = "$env:LOCALAPPDATA\Packages\E046963F.LenovoCompanion_k1h2ywk1493x8"
	$miVantageMVPPath = "$env:LOCALAPPDATA\Packages\E046963F.LenovoCompanionBeta_k1h2ywk1493x8"
    $miLEPath = "$env:LOCALAPPDATA\Packages\E046963F.LenovoSettingsforEnterprise_k1h2ywk1493x8"
    $IsInstallVantageLE = ((Test-Path $miVantagePath) -or (Test-Path $miVantageMVPPath) -or (Test-Path $miLEPath))
    if(-not($IsInstallVantageLE))
    {
        $miXmlFilePath = "$env:ProgramData\Lenovo\ImController\shared\MachineInformation.xml"

        $miXmlData = [xml](Get-Content $miXmlFilePath)
        $miCountry = ($miXmlData.MachineInformation.Country).ToLower()
        if($miCountry.Contains("cn"))
        {
            $miBrand = ($miXmlData.MachineInformation.Brand).ToLower()            
            $IsExclude = (($miBrand.Contains("idea")) -or ($miBrand.Contains("lenovo")))
        }

    }
    
    if($IsExclude)
    {
        #Is PCManager installed?
		$PcManagerRegPath = 'HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Lenovo\PcManager'
		$IsExclude = (Test-Path "Registry::$PcManagerRegPath")
    }

    return $IsExclude
}

# BG is installed?
Function BatteryGaugeIsInstalled
{
    $IsInstalled = $False
	$BGRegistryPath = 'HKEY_CLASSES_ROOT\CLSID\{E303DE81-073F-438A-B0D3-11C27526F607}'
	if(Test-Path "Registry::$BGRegistryPath")
	{
		$IsInstalled = $True
	}

    return $IsInstalled
}

# BG is pinned in taskbar?
Function IsBatteryGaugePinInTaskbar
{
	$IsBGPinned = 0

	$BgTaskList = tasklist /M "LenovoBatteryGaugePackage.dll"
	$ExplorerLike = $BgTaskList -like "explorer*"
	if($ExplorerLike -eq $true)
	{  
		$IsBGPinned = 1  
	}
	elseif($ExplorerLike -ne $false)
	{
		$BgInExplorer = (($ExplorerLike).ToLower()).Contains("explorer")
		if($BgInExplorer -eq $true)
		{  
			$IsBGPinned = 1  
		}
	}

	return $IsBGPinned
}

# ::***********************************************************************************************
# :: use "Trap" to handle terminating error( to force script running )
# ::***********************************************************************************************
trap 
{
	"An error trapped"
	$TrapError = $_.Exception
	$TrapErrorMsg = $TrapError.Message 
	$TrapLine = $_.InvocationInfo.ScriptLineNumber	
	Write-Log "Caught exception( trapped error ) at line[$TrapLine]: Msg= $TrapErrorMsg"
}

# ::***********************************************************************************************
# :: Begin installation
# ::
# :: 
# ::***********************************************************************************************

Write-Log "Below logs come from: $PSCommandPath"

# BG should be excluded from this device?
$BgInstalled = BatteryGaugeIsInstalled
if(BatteryGaugeShouldBeExclude)
{
	Write-Log "Exit... BatteryGauge should be excluded from device whom brand is Lenovo or Idea and PCManager has been installed(Geo = China(PRC))"

	# Delete BG if it has been installed
	if($BgInstalled -eq $True)
	{
		if (Test-Path "$PathPackageDirDest\$arch\$UninstallFileName")
		{
			Write-Log "Begin to uninstall BatteryGauge in the device which has installed PCManager...."
			$PSPATH="$env:SystemRoot\System32\WindowsPowerShell\v1.0\PowerShell.exe"
			Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList `"$PathPackageDirDest\$arch\$UninstallFileName`""
			Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList "$PathPackageDirDest\$arch\$UninstallFileName" *>&1 | Write-Log
		}
	}
		
	Exit
}

# Does package match OS bitness???
Write-Log "OperatingSystem=[$OS_BITNESS bit], Process=[$PS_BITNESS bit], Package=[$PK_BITNESS bit]"
if ($PS_BITNESS -eq 32)
{
	if ($PK_BITNESS -eq 64)
	{
		if ($OS_BITNESS -eq 32)
		{
			Write-Log "cannot install a 64 bit package in an 32 bit os."
		}
		else
		{
			Write-Log "Package bitness is 64 but process is 32.  Relaunching as 64"
			$PS64BITPATH="$env:SystemRoot\SysNative\WindowsPowerShell\v1.0\PowerShell.exe"
			Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PS64BITPATH -ArgumentList `"$PSCommandPath`""
			Start-Process -NoNewWindow -Wait -FilePath $PS64BITPATH -ArgumentList "$PSCommandPath" *>&1 | Write-Log
			Write-Log "Completed re-running as 64 bit"
			Exit
		}
	}
}
elseif ($PS_BITNESS -eq 64)
{
	if ($PK_BITNESS -eq 32)
	{
		Write-Log "Package bitness is 32 but process is 64.  Relaunching as 32"
		$PS32BITPATH="$env:SystemRoot\SysWOW64\WindowsPowerShell\v1.0\PowerShell.exe"
		Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PS32BITPATH -ArgumentList `"$PSCommandPath`""
		Start-Process -NoNewWindow -Wait -FilePath $PS32BITPATH -ArgumentList "$PSCommandPath" *>&1 | Write-Log
		Write-Log "Completed re-running as 32 bit"
		Exit
	}
}
else
{
	Write-Log "Package bitness unknown, will exit."
}


# ::***********************************************************************************************
# Expand shortcut with absolute path for BG control
# ::***********************************************************************************************
Expand-EnvironmentVariablesForLnkFileEx "ShowBatteryGauge"
Expand-EnvironmentVariablesForLnkFileEx "HideBatteryGauge"
Expand-EnvironmentVariablesForLnkFileEx "UnpinFromTaskbar"
Expand-EnvironmentVariablesForLnkFileEx "UnloadBatteryGaugeFromExplorer"
Expand-EnvironmentVariablesForLnkFileEx "SetMenuItemNameofBatteryGauge"
Expand-EnvironmentVariablesForLnkFileEx "UpdateBatteryGaugeToastInfo"


# ::**************************************************************************************************
# :: This section run only when current scripts running in package folder
# ::    1. Call uninstall.ps1 in the package folder if it has been install in this PC, and then delete package folder
# ::    2. Create package folder and copy content to it
# ::    3. Call install.ps1 in the package folder
# :: 
# ::**************************************************************************************************
$BgPinReg = 0
$BgPinTaskbar = 0
$BgForUpdate = $False
if ($PSScriptRoot -ne "$PathPackageDirDest\$arch")
{
	$BgForUpdate = $True
	Write-Log "Details of dest package info(old version)-------------------------"
	PrintDestPackageDetails
	

	#::***********************************************************************************************
	#:: [Check whether pinned battery gauge to taskbar previously]
	#::***********************************************************************************************
	$SID = GetCurrentActiveUserSID
	New-PSDrive -PSProvider Registry -Name HKU -Root HKEY_USERS *>&1 | Write-Log
	$BgPinReg = (Get-ItemProperty -Path HKU:$SID\SOFTWARE\Lenovo\BatteryGauge -Name "ShowInTaskbar" -ErrorAction SilentlyContinue).ShowInTaskbar
	
	## Is BG pinned ? Check it in taskbar
	$BgPinTaskbar = IsBatteryGaugePinInTaskbar
	
	$Pinned = 0
	if(($BgPinReg -eq 1) -or ($BgPinTaskbar -eq 1))
	{
		$Pinned = 1
	}
	
	Write-Log "The battery gauge previously status: BgPinReg = $BgPinReg, BgPinTaskbar=$BgPinTaskbar"
	
	#::***********************************************************************************************
	#:: [Uninstall the old version]
	#::***********************************************************************************************
	if (Test-Path "$PathPackageDirDest\$arch\$UninstallFileName")
	{
		Write-Log "Uninstall old version by call $UninstallFileName under package folder"
		Write-Log "Push-Location `"$PathPackageDirDest\$arch\`""
		Push-Location "$PathPackageDirDest\$arch\" *>&1 | Write-Log
		$PSPATH="$env:SystemRoot\System32\WindowsPowerShell\v1.0\PowerShell.exe"
		Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList `"$PathPackageDirDest\$arch\$UninstallFileName`""
		Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList "$PathPackageDirDest\$arch\$UninstallFileName ForUpdate" *>&1 | Write-Log
		Write-Log "Pop-Location"
		Pop-location *>&1 | Write-Log
		
		Write-Log "Remove old version package folder"
		Write-Log "Remove-Item -Recurse -Force `"$PathPackageDirDest`""
		Remove-Item -Recurse -Force "$PathPackageDirDest" *>&1 | Write-Log
	}

	#::***********************************************************************************************
	#:: [Copy new version to dest directory]
	#::***********************************************************************************************
	Write-Log "Make package folder for new version"
	Write-Log "New-Item `"$PathPackageDirDest\`" -type directory"
	New-Item "$PathPackageDirDest\" -type directory *>&1 | Write-Log

	## ::************************************************************************************************
	## :: [Rename the LenovoBatteryGaugePackage.dll file if this file haven't been removed. There was   ]
	## :: [issue which will lead this dll cannot unload from explorer due to in-use, then cannot replace]
	## :: [Can remove this operation from next version, since already fixed the in-use issue in the dll ]
	## ::************************************************************************************************
	if(Test-Path -Path "$PathPackageDirDest\x64\LenovoBatteryGaugePackage.dll" -PathType Leaf)
	{
		Remove-Item -Path "$PathPackageDirDest\x64\LenovoBatteryGaugePackage_bk.dll"  *>&1 | Write-Log
		Rename-Item -Path "$PathPackageDirDest\x64\LenovoBatteryGaugePackage.dll" -NewName "LenovoBatteryGaugePackage_bk.dll"  *>&1 | Write-Log
		#New-ItemProperty -Path HKU:$SID\SOFTWARE\Lenovo\BatteryGauge -Name "ShowInTaskbar" -Value $Pinned -PropertyType DWORD -Force
	}

	if(Test-Path -Path "$PathPackageDirDest\x86\LenovoBatteryGaugePackage.dll" -PathType Leaf)
	{
		Remove-Item -Path "$PathPackageDirDest\x86\LenovoBatteryGaugePackage_bk.dll"  *>&1 | Write-Log
		Rename-Item -Path "$PathPackageDirDest\x86\LenovoBatteryGaugePackage.dll" -NewName "LenovoBatteryGaugePackage_bk.dll"  *>&1 | Write-Log
		#New-ItemProperty -Path HKU:$SID\SOFTWARE\Lenovo\BatteryGauge -Name "ShowInTaskbar" -Value $Pinned -PropertyType DWORD -Force
	}
	
	Remove-PSDrive -Name HKU *>&1 | Write-Log

	# Copy source files to destination directory
	Write-Log "Copy new version package contents to package folder, and give neccessary privileage"
	Write-Log "Copy-Item `"$PSScriptRoot\..\*`" `"$PathPackageDirDest\`" -force -recurse -verbose"
	Copy-Item "$PSScriptRoot\..\*" "$PathPackageDirDest\" -force -recurse -verbose *>&1 | Write-Log
		
	Write-Log "Install new version by call $InstallFileName under package folder"
	Write-Log "Push-Location `"$PathPackageDirDest\$arch\`""
	Push-Location "$PathPackageDirDest\$arch\" *>&1 | Write-Log
	$PSPATH="$env:SystemRoot\System32\WindowsPowerShell\v1.0\PowerShell.exe"
	Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList `"$PathPackageDirDest\$arch\$InstallFileName`""
	Start-Process -NoNewWindow -Wait -FilePath $PSPATH -ArgumentList "$PathPackageDirDest\$arch\$InstallFileName $Pinned" *>&1 | Write-Log

	Write-Log "Pop-location"
	Pop-location *>&1 | Write-Log
	Write-Log "completed re-running in the package folder"
	
	Write-Log "Remove temporary install package folder"
	Write-Log "Remove-Item -Recurse -Force `"$PSScriptRoot\..`""
	Remove-Item -Recurse -Force "$PSScriptRoot\.." *>&1 | Write-Log
	
	# Check update pinned status
	$BgPinTaskbar = IsBatteryGaugePinInTaskbar
	New-PSDrive -PSProvider Registry -Name HKU -Root HKEY_USERS *>&1 | Write-Log
	$BgPinReg = (Get-ItemProperty -Path HKU:$SID\SOFTWARE\Lenovo\BatteryGauge -Name "ShowInTaskbar" -ErrorAction SilentlyContinue).ShowInTaskbar
	
	Write-Log "The battery gauge previously status: BgPinReg = $BgPinReg, BgPinTaskbar=$BgPinTaskbar, BgForUpdate=$BgForUpdate"
	Write-Log "Details of dest package info(new version)-------------------------"
	PrintDestPackageDetails
	
	Write-Log "Update-Install sucessful!"
	Exit
}

# ::***********************************************************************************************
# :: [Uninstall old Lenovo Battery Gauge ]
# ::***********************************************************************************************
if (Get-Variable ProdCode64 -ErrorAction SilentlyContinue) {
	UninstallMsi($ProdCode64)
}
if (Get-Variable ProdCode32 -ErrorAction SilentlyContinue) {
	UninstallMsi($ProdCode32)
}
if (Get-Variable ProdCode64_OLD -ErrorAction SilentlyContinue) {
	UninstallMsi($ProdCode64_OLD)
}
if (Get-Variable ProdCode32_OLD -ErrorAction SilentlyContinue) {
	UninstallMsi($ProdCode32_OLD)
}

# ::***********************************************************************************************
# :: [Kill active BG processes]:
# ::  QuickSetting.exe,QuickSettingEx.exe,HeartbeatMetrics.exe,SetThinkTouchPad.exe]
# ::***********************************************************************************************
StopProcessByTaskkill

# ::***********************************************************************************************
# :: [Register PluginsContract.dll ]
# ::***********************************************************************************************
Write-Log "Start-Process -NoNewWindow -Wait -FilePath $PathPackageDirDest\$arch\RegAsm.exe -ArgumentList `"/silent $PathPackageDirDest\$arch\PluginsContract.dll`""
Start-Process -NoNewWindow -Wait -FilePath $PathPackageDirDest\$arch\RegAsm.exe -ArgumentList "/silent $PathPackageDirDest\$arch\PluginsContract.dll" *>&1 | Write-Log
if($? -ne $true)
{
	Write-Log "Registry PluginsContract.dll into system return code $LastExitCode"
}

# ::***********************************************************************************************
# :: [Register LenovoBatteryGaugePackage.dll ]
# ::***********************************************************************************************
Write-Log "Start-Process -NoNewWindow -Wait -FilePath regsvr32.exe -ArgumentList `"/s $PathPackageDirDest\$arch\LenovoBatteryGaugePackage.dll`""
Start-Process -NoNewWindow -Wait -FilePath regsvr32.exe -ArgumentList "/s $PathPackageDirDest\$arch\LenovoBatteryGaugePackage.dll" *>&1 | Write-Log
if($? -ne $true)
{
	Write-Log "Registry battery gauge to system return code $LastExitCode"
}

# ::***********************************************************************************************
# :: [Create Lenovo Battery Gauge Registry Entries ]
# ::***********************************************************************************************
Write-Log "Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList `"add HKLM\Software\Lenovo\QuickSetting /f`""
Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList "add HKLM\Software\Lenovo\QuickSetting /f" *>&1 | Write-Log
if($? -ne $true)
{
	Write-Log "Add registry key `"HKLM\Software\Lenovo\QuickSetting`" return code $LastExitCode"
}

Write-Log "Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList `"add HKLM\Software\Lenovo\QuickSetting /v Path /t REG_SZ /d $PathPackageDirDest\$arch\ /f`""
Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList "add HKLM\Software\Lenovo\QuickSetting /v Path /t REG_SZ /d `"$PathPackageDirDest\$arch\\`" /f" *>&1 | Write-Log
if($? -ne $true)
{
	Write-Log "Add registry value `"Path`" to `"HKLM\Software\Lenovo\QuickSetting`" return code $LastExitCode"
}

Write-Log "Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList `"add HKLM\Software\Lenovo\QuickSetting /v Location /t REG_SZ /d $PathPackageDirDest\$arch\QuickSetting.exe /f`""
Start-Process -NoNewWindow -Wait -FilePath reg.exe -ArgumentList "add HKLM\Software\Lenovo\QuickSetting /v Location /t REG_SZ /d `"$PathPackageDirDest\$arch\QuickSetting.exe`" /f" *>&1 | Write-Log
if($? -ne $true)
{
	Write-Log "Add registry value `"Location`" to `"HKLM\Software\Lenovo\QuickSetting`" return code $LastExitCode"
}

# ::***********************************************************************************************
# :: [ Pin to task bar if needed]
# ::***********************************************************************************************
Write-Log "installing param is: $($args[0])"
if ($($args[0]) -eq 1)
{
	$retCtrl = BatteryGaugeIconControl($ShowBg)
	if($retCtrl -eq 0)
	{
		Write-Log "Try to show BatteryyGauge again..., ReturnCode=$LastExitCode"
		Start-Sleep -Milliseconds 400	
		$retCtrl = BatteryGaugeIconControl($ShowBg)
	}
	Write-Log "Show battery gauge icon on task tray result: show = $retCtrl, ReturnCode=$LastExitCode"
}

Write-Log "Install sucessful!"
Exit

# SIG # Begin signature block
# MIIcZQYJKoZIhvcNAQcCoIIcVjCCHFICAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCC16SvTVUcSSv5X
# rOuwZ3pv0EJQo3nq5pXIzPMzhd6WMqCCF2AwggPuMIIDV6ADAgECAhB+k+v7fMZO
# WepLmnfUBvw7MA0GCSqGSIb3DQEBBQUAMIGLMQswCQYDVQQGEwJaQTEVMBMGA1UE
# CBMMV2VzdGVybiBDYXBlMRQwEgYDVQQHEwtEdXJiYW52aWxsZTEPMA0GA1UEChMG
# VGhhd3RlMR0wGwYDVQQLExRUaGF3dGUgQ2VydGlmaWNhdGlvbjEfMB0GA1UEAxMW
# VGhhd3RlIFRpbWVzdGFtcGluZyBDQTAeFw0xMjEyMjEwMDAwMDBaFw0yMDEyMzAy
# MzU5NTlaMF4xCzAJBgNVBAYTAlVTMR0wGwYDVQQKExRTeW1hbnRlYyBDb3Jwb3Jh
# dGlvbjEwMC4GA1UEAxMnU3ltYW50ZWMgVGltZSBTdGFtcGluZyBTZXJ2aWNlcyBD
# QSAtIEcyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsayzSVRLlxwS
# CtgleZEiVypv3LgmxENza8K/LlBa+xTCdo5DASVDtKHiRfTot3vDdMwi17SUAAL3
# Te2/tLdEJGvNX0U70UTOQxJzF4KLabQry5kerHIbJk1xH7Ex3ftRYQJTpqr1SSwF
# eEWlL4nO55nn/oziVz89xpLcSvh7M+R5CvvwdYhBnP/FA1GZqtdsn5Nph2Upg4XC
# YBTEyMk7FNrAgfAfDXTekiKryvf7dHwn5vdKG3+nw54trorqpuaqJxZ9YfeYcRG8
# 4lChS+Vd+uUOpyyfqmUg09iW6Mh8pU5IRP8Z4kQHkgvXaISAXWp4ZEXNYEZ+VMET
# fMV58cnBcQIDAQABo4H6MIH3MB0GA1UdDgQWBBRfmvVuXMzMdJrU3X3vP9vsTIAu
# 3TAyBggrBgEFBQcBAQQmMCQwIgYIKwYBBQUHMAGGFmh0dHA6Ly9vY3NwLnRoYXd0
# ZS5jb20wEgYDVR0TAQH/BAgwBgEB/wIBADA/BgNVHR8EODA2MDSgMqAwhi5odHRw
# Oi8vY3JsLnRoYXd0ZS5jb20vVGhhd3RlVGltZXN0YW1waW5nQ0EuY3JsMBMGA1Ud
# JQQMMAoGCCsGAQUFBwMIMA4GA1UdDwEB/wQEAwIBBjAoBgNVHREEITAfpB0wGzEZ
# MBcGA1UEAxMQVGltZVN0YW1wLTIwNDgtMTANBgkqhkiG9w0BAQUFAAOBgQADCZuP
# ee9/WTCq72i1+uMJHbtPggZdN1+mUp8WjeockglEbvVt61h8MOj5aY0jcwsSb0ep
# rjkR+Cqxm7Aaw47rWZYArc4MTbLQMaYIXCp6/OJ6HVdMqGUY6XlAYiWWbsfHN2qD
# IQiOQerd2Vc/HXdJhyoWBl6mOGoiEqNRGYN+tjCCBKMwggOLoAMCAQICEA7P9DjI
# /r81bgTYapgbGlAwDQYJKoZIhvcNAQEFBQAwXjELMAkGA1UEBhMCVVMxHTAbBgNV
# BAoTFFN5bWFudGVjIENvcnBvcmF0aW9uMTAwLgYDVQQDEydTeW1hbnRlYyBUaW1l
# IFN0YW1waW5nIFNlcnZpY2VzIENBIC0gRzIwHhcNMTIxMDE4MDAwMDAwWhcNMjAx
# MjI5MjM1OTU5WjBiMQswCQYDVQQGEwJVUzEdMBsGA1UEChMUU3ltYW50ZWMgQ29y
# cG9yYXRpb24xNDAyBgNVBAMTK1N5bWFudGVjIFRpbWUgU3RhbXBpbmcgU2Vydmlj
# ZXMgU2lnbmVyIC0gRzQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCi
# Yws5RLi7I6dESbsO/6HwYQpTk7CY260sD0rFbv+GPFNVDxXOBD8r/amWltm+YXkL
# W8lMhnbl4ENLIpXuwitDwZ/YaLSOQE/uhTi5EcUj8mRY8BUyb05Xoa6IpALXKh7N
# S+HdY9UXiTJbsF6ZWqidKFAOF+6W22E7RVEdzxJWC5JH/Kuu9mY9R6xwcueS51/N
# ELnEg2SUGb0lgOHo0iKl0LoCeqF3k1tlw+4XdLxBhircCEyMkoyRLZ53RB9o1qh0
# d9sOWzKLVoszvdljyEmdOsXF6jML0vGjG/SLvtmzV4s73gSneiKyJK4ux3DFvk6D
# Jgj7C72pT5kI4RAocqrNAgMBAAGjggFXMIIBUzAMBgNVHRMBAf8EAjAAMBYGA1Ud
# JQEB/wQMMAoGCCsGAQUFBwMIMA4GA1UdDwEB/wQEAwIHgDBzBggrBgEFBQcBAQRn
# MGUwKgYIKwYBBQUHMAGGHmh0dHA6Ly90cy1vY3NwLndzLnN5bWFudGVjLmNvbTA3
# BggrBgEFBQcwAoYraHR0cDovL3RzLWFpYS53cy5zeW1hbnRlYy5jb20vdHNzLWNh
# LWcyLmNlcjA8BgNVHR8ENTAzMDGgL6AthitodHRwOi8vdHMtY3JsLndzLnN5bWFu
# dGVjLmNvbS90c3MtY2EtZzIuY3JsMCgGA1UdEQQhMB+kHTAbMRkwFwYDVQQDExBU
# aW1lU3RhbXAtMjA0OC0yMB0GA1UdDgQWBBRGxmmjDkoUHtVM2lJjFz9eNrwN5jAf
# BgNVHSMEGDAWgBRfmvVuXMzMdJrU3X3vP9vsTIAu3TANBgkqhkiG9w0BAQUFAAOC
# AQEAeDu0kSoATPCPYjA3eKOEJwdvGLLeJdyg1JQDqoZOJZ+aQAMc3c7jecshaAba
# tjK0bb/0LCZjM+RJZG0N5sNnDvcFpDVsfIkWxumy37Lp3SDGcQ/NlXTctlzevTcf
# Q3jmeLXNKAQgo6rxS8SIKZEOgNER/N1cdm5PXg5FRkFuDbDqOJqxOtoJcRD8HHm0
# gHusafT9nLYMFivxf1sJPZtb4hbKE4FtAC44DagpjyzhsvRaqQGvFZwsL0kb2yK7
# w/54lFHDhrGCiF3wPbRRoXkzKy57udwgCRNx62oZW8/opTBXLIlJP7nPf8m/PiJo
# Y1OavWl0rMUdPH+S4MO8HNgEdTCCBLkwggOhoAMCAQICEEAaxGQhsxMhAw675BIa
# xR0wDQYJKoZIhvcNAQELBQAwgb0xCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5WZXJp
# U2lnbiwgSW5jLjEfMB0GA1UECxMWVmVyaVNpZ24gVHJ1c3QgTmV0d29yazE6MDgG
# A1UECxMxKGMpIDIwMDggVmVyaVNpZ24sIEluYy4gLSBGb3IgYXV0aG9yaXplZCB1
# c2Ugb25seTE4MDYGA1UEAxMvVmVyaVNpZ24gVW5pdmVyc2FsIFJvb3QgQ2VydGlm
# aWNhdGlvbiBBdXRob3JpdHkwHhcNMDgwNDAyMDAwMDAwWhcNMzcxMjAxMjM1OTU5
# WjCBvTELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYD
# VQQLExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwOCBW
# ZXJpU2lnbiwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MTgwNgYDVQQD
# Ey9WZXJpU2lnbiBVbml2ZXJzYWwgUm9vdCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0
# eTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdhN16xATTbYtcVm/9Y
# WowjI9ZgjpHXkJiDeuZYGTiMxfblZIW0onH77b252s1NALTILXOlx2lxlR85PLJE
# B5zoDvpNSsQh3ylhjzIiYYLFhx9ujHxfFiBRRNFwT1fq4xzjzHnuWNgOwrNFk8As
# 55oXK3sAN3pBM3jhM+LzEBp/hyy+9vX3QuLlv4diiV8AS9/F3eR1RDJBOh5xbmnL
# C3VGCNHK0iuV0M/7uUBrZIxXTfwTEXmE7V5U9jSfCAHzECUGF0ra8R16ZmuYYGak
# 2e/SLoLx8O8J6kTJFWriA24z06yfVQDH9ghqlLlf3OAz8YRg+VsnEbT8FvK7VmqA
# JY0CAwEAAaOBsjCBrzAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjBt
# BggrBgEFBQcBDARhMF+hXaBbMFkwVzBVFglpbWFnZS9naWYwITAfMAcGBSsOAwIa
# BBSP5dMahqyNjmvDz4Bq1EgYLHsZLjAlFiNodHRwOi8vbG9nby52ZXJpc2lnbi5j
# b20vdnNsb2dvLmdpZjAdBgNVHQ4EFgQUtnf6aUhHn1MS1cLqBzJ2B9GXBxkwDQYJ
# KoZIhvcNAQELBQADggEBAEr4+LAD5ixne+SUd2PMbkz5fQ4N3Mi5NblwT2P6JPps
# g4xHnTtj85r5djKVkbF3vKyavrHkMSHGgZVWWg6xwtSxplms8WPLuEwdWZBK75AW
# KB9arhD7gVA4DGzM8T3D9WPjs+MhySQ56f0VZkb0GxHQTXOjfUb5Pe2oX2LU8T/4
# 4HRXKxidgbTEKNqUl6Vw66wdvgcR8NXb3eWM8NUysIPmV+KPv76hqr89HbXUOOrX
# sFw6T2o/j8BmbGOq6dmkFvSB0ZUUDn3NlTTZ0o9wc4F7nH69mGHYRYeYkMXrhjDG
# Nb/w/8NViINL7wWSBnHyuJiTt+zNgmHxOOZPl5gqWo0wggS7MIIDo6ADAgECAhBm
# WMW/humRJPmXSLCnoBVMMA0GCSqGSIb3DQEBCwUAMIGEMQswCQYDVQQGEwJVUzEd
# MBsGA1UEChMUU3ltYW50ZWMgQ29ycG9yYXRpb24xHzAdBgNVBAsTFlN5bWFudGVj
# IFRydXN0IE5ldHdvcmsxNTAzBgNVBAMTLFN5bWFudGVjIENsYXNzIDMgU0hBMjU2
# IENvZGUgU2lnbmluZyBDQSAtIEcyMB4XDTE4MDkwMTAwMDAwMFoXDTE5MTEyMzIz
# NTk1OVowbDELMAkGA1UEBhMCVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRQw
# EgYDVQQHDAtNb3JyaXN2aWxsZTEPMA0GA1UECgwGTGVub3ZvMQwwCgYDVQQLDANH
# MDgxDzANBgNVBAMMBkxlbm92bzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
# ggEBAN3VVhRGDAPbpikxYIFh0LHJ/rh1KhI4ggpUYKKhudiqPNmk+Vy2x2d9yJHZ
# AONYaBU26b+mGejpfOTnjw/IrYq82KH9T4lvXhwEdU+0fmdZVXKULGQVyBHe70dw
# lODX7uuMLtKrT1JJuf8q1HXMO3uPjeP8q6Wmh/wj5JP4gbkGbqPtQgrSUZo18QJi
# OU7KTgVwgS7TCFON4M3M4Aa9KEWQRYKJuu3Ip29rtZ1pe4gozWcuy2WJFZBvsVwR
# RXhAqDs5It3HLTgnm/ei5l/xmYHg3lfN0ukNJd50AXGYGEWQel2Nhs00RUldy8hm
# i1Grr68gMucgEghgMcCMNjTd00kCAwEAAaOCAT4wggE6MAkGA1UdEwQCMAAwDgYD
# VR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMGEGA1UdIARaMFgwVgYG
# Z4EMAQQBMEwwIwYIKwYBBQUHAgEWF2h0dHBzOi8vZC5zeW1jYi5jb20vY3BzMCUG
# CCsGAQUFBwICMBkMF2h0dHBzOi8vZC5zeW1jYi5jb20vcnBhMB8GA1UdIwQYMBaA
# FNTABiJJ6zlL3ZPiXKG4R3YJcgNYMCsGA1UdHwQkMCIwIKAeoByGGmh0dHA6Ly9y
# Yi5zeW1jYi5jb20vcmIuY3JsMFcGCCsGAQUFBwEBBEswSTAfBggrBgEFBQcwAYYT
# aHR0cDovL3JiLnN5bWNkLmNvbTAmBggrBgEFBQcwAoYaaHR0cDovL3JiLnN5bWNi
# LmNvbS9yYi5jcnQwDQYJKoZIhvcNAQELBQADggEBAJbykOZtqQRSifuDgbjK5C0F
# BNiXX+HkzfjDJwYUvDHW++NDY2fY5jADI9Ls6yBnMfwUqEGdwUut+JIhCPlP0mvo
# OrksHxMTMwywpXyz5r0Lfi7EsNbDbfuSU1kASgQc/qsV50ZJegtj4k/YwY0IjsU9
# fMQQ+5JP4K/2rNT0xxaGhhWj7Ir2KtZKg3hcf3Z7GtuErnSIRzUautAZTro/4F1m
# bknXIlX3CmGi7I2zpDN7l181LkJ3oHwewYno0V6ExY0Qn6G3uymZFSREGSML/3Bm
# NtLVecqG3L6G/s0HqtS8iqEPkSYkvjI+a6tlzzZAmRfl0gpdGiXJ5sy1s0x2SmEw
# ggVHMIIEL6ADAgECAhB8GzU1SufbdOdBXxFpymuoMA0GCSqGSIb3DQEBCwUAMIG9
# MQswCQYDVQQGEwJVUzEXMBUGA1UEChMOVmVyaVNpZ24sIEluYy4xHzAdBgNVBAsT
# FlZlcmlTaWduIFRydXN0IE5ldHdvcmsxOjA4BgNVBAsTMShjKSAyMDA4IFZlcmlT
# aWduLCBJbmMuIC0gRm9yIGF1dGhvcml6ZWQgdXNlIG9ubHkxODA2BgNVBAMTL1Zl
# cmlTaWduIFVuaXZlcnNhbCBSb290IENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4X
# DTE0MDcyMjAwMDAwMFoXDTI0MDcyMTIzNTk1OVowgYQxCzAJBgNVBAYTAlVTMR0w
# GwYDVQQKExRTeW1hbnRlYyBDb3Jwb3JhdGlvbjEfMB0GA1UECxMWU3ltYW50ZWMg
# VHJ1c3QgTmV0d29yazE1MDMGA1UEAxMsU3ltYW50ZWMgQ2xhc3MgMyBTSEEyNTYg
# Q29kZSBTaWduaW5nIENBIC0gRzIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
# AoIBAQDXlUPU3N9nrjn7UqS2JjEEcOm3jlsqujdpNZWPu8Aw54bYc7vf69F2P4pW
# justS/BXGE6xjaUz0wt1I9VqeSfdo9P3Dodltd6tHPH1NbQiUa8iocFdS5B/wFlO
# q515qQLXHkmxO02H/sJ4q7/vUq6crwjZOeWaUT5pXzAQTnFjbFjh8CAzGw90vlvL
# EuHbjMSAlHK79kWansElC/ujHJ7YpglwcezAR0yPfcPeGc4+7gRyjhfT//CyBTIZ
# TNOwHJ/+pXggQnBBsCaMbwDIOgARQXpBsKeKkQSgmXj0d7TzYCrmbFAEtxRg/w1R
# 9KiLhP4h2lxeffUpeU+wRHRvbXL/AgMBAAGjggF4MIIBdDAuBggrBgEFBQcBAQQi
# MCAwHgYIKwYBBQUHMAGGEmh0dHA6Ly9zLnN5bWNkLmNvbTASBgNVHRMBAf8ECDAG
# AQH/AgEAMGYGA1UdIARfMF0wWwYLYIZIAYb4RQEHFwMwTDAjBggrBgEFBQcCARYX
# aHR0cHM6Ly9kLnN5bWNiLmNvbS9jcHMwJQYIKwYBBQUHAgIwGRoXaHR0cHM6Ly9k
# LnN5bWNiLmNvbS9ycGEwNgYDVR0fBC8wLTAroCmgJ4YlaHR0cDovL3Muc3ltY2Iu
# Y29tL3VuaXZlcnNhbC1yb290LmNybDATBgNVHSUEDDAKBggrBgEFBQcDAzAOBgNV
# HQ8BAf8EBAMCAQYwKQYDVR0RBCIwIKQeMBwxGjAYBgNVBAMTEVN5bWFudGVjUEtJ
# LTEtNzI0MB0GA1UdDgQWBBTUwAYiSes5S92T4lyhuEd2CXIDWDAfBgNVHSMEGDAW
# gBS2d/ppSEefUxLVwuoHMnYH0ZcHGTANBgkqhkiG9w0BAQsFAAOCAQEAf+vKp+qL
# dkLrPo4gVDDjt7nc+kg+FscPRZUQzSeGo2bzAu1x+KrCVZeRcIP5Un5SaTzJ8eCU
# RoAYu6HUpFam8x0AkdWG80iH4MvENGggXrTL+QXtnK9wUye56D5+UaBpcYvcUe2A
# OiUyn0SvbkMo0yF1u5fYi4uM/qkERgSF9xWcSxGNxCwX/tVuf5riVpLxlrOtLfn0
# 39qJmc6yOETA90d7yiW5+ipoM5tQct6on9TNLAs0vYsweEDgjY4nG5BvGr4IFYFd
# 6y/iUedRHsl4KeceZb847wFKAQkkDhbEFHnBQTc00D2RUpSd4WjvCPDiaZxnbpAL
# GpNx1CYCw8BaIzGCBFswggRXAgEBMIGZMIGEMQswCQYDVQQGEwJVUzEdMBsGA1UE
# ChMUU3ltYW50ZWMgQ29ycG9yYXRpb24xHzAdBgNVBAsTFlN5bWFudGVjIFRydXN0
# IE5ldHdvcmsxNTAzBgNVBAMTLFN5bWFudGVjIENsYXNzIDMgU0hBMjU2IENvZGUg
# U2lnbmluZyBDQSAtIEcyAhBmWMW/humRJPmXSLCnoBVMMA0GCWCGSAFlAwQCAQUA
# oIGEMBgGCisGAQQBgjcCAQwxCjAIoAKAAKECgAAwGQYJKoZIhvcNAQkDMQwGCisG
# AQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcN
# AQkEMSIEILP+0nfNuwBnLVf+5You1JNyV3c57D1+wV/iz5/Bhz8TMA0GCSqGSIb3
# DQEBAQUABIIBAGam1mU1Lv81HDgQepMpKiLM3x4rCetD/TPc298OydOXHinsfxgC
# GHy3EkLmays5Uv9ZfiwchMcRl9B0aH0v87khk7eSH75BabnYW7G+NUeU0T7rD/Uo
# 1UnBDKqpTrUu7lHidvuWQh0Rssyrq0vnc8Mr9n+pV1bUwaqVoz7wUylbeThD0pUz
# deXZ87ZyA8BsBGzf08lL9w0qIEoSF8J6lubP0seiQ5OK1z49O38FW9vSk9b6BhLH
# RnYsFyw1VAa0JU9hGIxxvTXfp9v5Z/UxxprdWuTP/6476v/fkhzMOIvUTPbHgPkg
# Ij0fhCDPIEdhn7IHsdDvvp/EEph827onBbWhggILMIICBwYJKoZIhvcNAQkGMYIB
# +DCCAfQCAQEwcjBeMQswCQYDVQQGEwJVUzEdMBsGA1UEChMUU3ltYW50ZWMgQ29y
# cG9yYXRpb24xMDAuBgNVBAMTJ1N5bWFudGVjIFRpbWUgU3RhbXBpbmcgU2Vydmlj
# ZXMgQ0EgLSBHMgIQDs/0OMj+vzVuBNhqmBsaUDAJBgUrDgMCGgUAoF0wGAYJKoZI
# hvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTkxMDA4MDgxMTMz
# WjAjBgkqhkiG9w0BCQQxFgQUlja9DTF3CgS4iElgbCnXcOzV5Y4wDQYJKoZIhvcN
# AQEBBQAEggEAAXIUIH4raPkjod6KdDM4hYLBbHvHQb2hc9F0vMdAxHo5iAye7zhs
# x2vanuoHA5psRelHxa8yzsGi3SlasYXkWflSu7hSLTTXArlk42ynuaTFEawewn/V
# 9zYG3kWxYp3sEaxTT5pus1h/TVc4pCoaBLhigX/vYOJ0Exl/STpYlHsGN8+oepxD
# Tx2u5JYCAq59aKLhd61jmlvekoC48r6cu9MSm8rqZYloerkSi62QpwXlICPCP/09
# GRsC+UWB2NlUxzS+XWc48slIXtbD8bW82GdiZRfb+Dxvc6XLLZRhyLFk3BUIjxqb
# Y4e/MvGm2B7ffgxQel8mgzMCRnAaf529YQ==
# SIG # End signature block
