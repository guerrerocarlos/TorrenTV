; TorrenTV 
; Installer Source
; Version 1.0

;Include Modern UI
!include "MUI2.nsh"

;General Settings
!searchparse /file "../../package.json" `  "version": "` PT_VERSION `",`
!searchreplace PT_VERSION "${PT_VERSION}" "-" "."
Name "TorrenTV"
Caption "TorrenTV v${PT_VERSION}"
BrandingText "TorrenTV v${PT_VERSION}"
VIAddVersionKey "ProductName" "TorrenTV"
VIAddVersionKey "ProductVersion" "v${PT_VERSION}"
VIAddVersionKey "FileDescription" "TorrenTV v${PT_VERSION} Installer"
VIAddVersionKey "FileVersion" "v${PT_VERSION}"
VIAddVersionKey "CompanyName" "TorrenTV Official"
VIAddVersionKey "LegalCopyright" "http://torrentv.github.io"
VIProductVersion "${PT_VERSION}.0"
OutFile "TorrenTVSetup.exe"
CRCCheck on
SetCompressor /SOLID lzma

;Default installation folder
InstallDir "$LOCALAPPDATA\TorrenTV"

;Request application privileges
RequestExecutionLevel user

;Define UI settings
!define MUI_LICENSEPAGE_BGCOLOR /GRAY
!define MUI_UI_HEADERIMAGE_RIGHT "..\..\src\app\images\icon.png"
!define MUI_ICON "..\..\src\app\images\favicon.ico"
!define MUI_UNICON "..\..\src\app\images\favicon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "installer-image.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "uninstaller-image.bmp"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_LINK "TorrenTV Official Homepage"
!define MUI_FINISHPAGE_LINK_LOCATION "http://torrentv.github.io/"

;Define the pages
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

;Define uninstall pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

;Load Language Files
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "SpanishInternational"

Section ; Node Webkit Files

	;Delete existing install
	RMDir /r "$INSTDIR"

	;Set output path to InstallDir
	SetOutPath "$INSTDIR\node-webkit"

	;Add the files
	File "..\..\build\cache\win\0.9.2\*.dll"
	File "/oname=TorrenTV.exe" "..\..\build\cache\win\0.9.2\nw.exe"
	File "..\..\build\cache\win\0.9.2\nw.pak"

SectionEnd

Section ; App Files

	;Set output path to InstallDir
	SetOutPath "$INSTDIR\src"

	;Add the files
    File /r "..\..\src\app"

	SetOutPath "$INSTDIR"
	File "..\..\package.json"

	SetOutPath "$INSTDIR\node_modules"
	File /r /x "*grunt*" "..\..\node_modules\*.*"

	;Create uninstaller
	WriteUninstaller "$INSTDIR\Uninstall.exe"

SectionEnd

Section ; Shortcuts

	;Working Directory
	SetOutPath "$INSTDIR"
    
	CreateShortCut "$INSTDIR\TorrenTV.lnk" "$INSTDIR\node-webkit\TorrenTV.exe" "." "$INSTDIR\src\app\images\favicon.ico" "" "" "" "TorrenTV"

	;Start Menu Shortcut
	RMDir /r "$SMPROGRAMS\TorrenTV"
	CreateDirectory "$SMPROGRAMS\TorrenTV"
	CreateShortCut "$SMPROGRAMS\TorrenTV\TorrenTV.lnk" "$INSTDIR\node-webkit\TorrenTV.exe" "." "$INSTDIR\src\app\images\favicon.ico" "" "" "" "TorrenTV"
	CreateShortCut "$SMPROGRAMS\TorrenTV\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\src\app\images\favicon.ico" "" "" "" "Uninstall TorrenTV"

	;Desktop Shortcut
	Delete "$DESKTOP\TorrenTV.lnk"
	CreateShortCut "$DESKTOP\TorrenTV.lnk" "$INSTDIR\node-webkit\TorrenTV.exe" "." "$INSTDIR\src\app\images\favicon.ico" "" "" "" "TorrenTV"

SectionEnd

Section "uninstall" ; Uninstaller

	RMDir /r "$INSTDIR"
	RMDir /r "$SMPROGRAMS\TorrenTV"
	Delete "$DESKTOP\TorrenTV.lnk"
	
SectionEnd
