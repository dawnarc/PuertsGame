@echo off
IF EXIST ..\..\tsconfig.json (
    del ..\..\tsconfig.json
) 

node enable_puerts_module.js