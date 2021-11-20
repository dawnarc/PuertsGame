##### Summary
This's personal study notes of PuerTS which is script plugin for game development, it's available for Unity, Unreal.

Official tutorial:
跟我用TypeScript做一个FPS游戏  
https://zhuanlan.zhihu.com/p/346531865

##### Setup

Showcase
{{< figure src="docs/screenshoots/screenshoot_1.gif">}}

+ Install Unreal Engine 4.
+ Install nodejs: https://nodejs.org/en/download/
+ Clone puerts from https://github.com/Tencent/puerts
+ Copy directory `puerts/unreal/Puerts/` into this project:`PuertsGame/Plugins/Puerts/`.
+ Open cmd and address to directory `PuertsGame/Plugins/Puerts/`, execute command: `node enable_puerts_module.js`.
+ Bulid from visual studio, and start editor, then click plugin button `ud.d.ts`:
{{< figure src="docs/screenshoots/screenshoot_2.png">}}
+ If cann't find `TS_BaseGun`, `TS_Player` and `TS_Rifle` in directory `PuertsGame/Blueprints/TypeScript/`, which were generated by `PuerTS`, in editor content browser.
{{< figure src="docs/screenshoots/screenshoot_3.png">}}
You need to edit these TypeScript source file to fire hot swapping of `PuerTS` by adding a blank line is each source file.  
{{< figure src="docs/screenshoots/screenshoot_4.png">}}
If add a blank line and save file, then `PuerTS` would auto compile this TypeScript source and auto generate Unreal `.uasset` file under directory `PuertsGame/Blueprints/TypeScript/`
{{< figure src="docs/screenshoots/screenshoot_5.png">}}
