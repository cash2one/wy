@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "E:\github\lfp-mock-web\bin\lfp-mock-web" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "E:\github\lfp-mock-web\bin\lfp-mock-web" %*
)
