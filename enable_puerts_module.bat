@echo off
IF EXIST tsconfig.json (
    del tsconfig.json
) 

node ./Plugins/Puerts/enable_puerts_module.js