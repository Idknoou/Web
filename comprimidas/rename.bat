@echo off
set "prefijo=comp-"

for %%F in (*) do (
    if not "%%~nxF"=="%~nx0" (
        ren "%%F" "%prefijo%%%~nxF"
    )
)
