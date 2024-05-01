
import * as UE from 'ue'
import {$ref, $unref} from 'puerts'
import {uproperty} from 'ue'

import TS_BaseGun from './TS_BaseGun'
import './ObjectExt'

function delay(t:number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t);
    });
}

class TS_Player extends UE.Character 
{
    FpsCamera: UE.CameraComponent;
    EquippedGun:TS_BaseGun;
    @uproperty.attach("FpsCamera")
    GunLocation:UE.SceneComponent;
    CanShoot: boolean;

    Constructor() 
    {
        this.CanShoot = true;

        this.bUseControllerRotationYaw = true;
        this.bUseControllerRotationPitch = true;
    }

    MoveForward(axisValue: number): void 
    {
        this.AddMovementInput(this.GetActorForwardVector(), axisValue, false);
    }

    MoveRight(axisValue: number): void 
    {
        this.AddMovementInput(this.GetActorRightVector(), axisValue, false);
    }

    LookHorizontal(axisValue: number): void 
    {
        this.AddControllerYawInput(axisValue);
    }

    LookVertical(axisValue: number): void 
    {
        this.AddControllerPitchInput(axisValue * -1);
    }

    //@no-blueprint
    async AShoot(axisValue: number): Promise<void> {
        //console.log("=========== aaaaaa ", axisValue);
        if (axisValue == 1 && this.CanShoot) {
            let cameraLocation = this.FpsCamera.K2_GetComponentLocation();
            let endLocation = cameraLocation.op_Addition(this.FpsCamera.GetForwardVector().op_Multiply(this.EquippedGun.MaxBulletDistance));
            this.EquippedGun.Shoot(cameraLocation, endLocation);
            this.CanShoot = false;
            await delay(this.EquippedGun.FireRate * 1000);//TODO: 支持Latent方法转async方法后，可以用KismetSystemLibrary.Delay
            this.CanShoot = true;
        }
    }
    
    Shoot(axisValue: number): void 
    {
        this.AShoot(axisValue)
    }

    ReceiveBeginPlay(): void 
    {
        this.FpsCamera.K2_SetRelativeLocationAndRotation(new UE.Vector(0, 0, 90), undefined, false, $ref<UE.HitResult>(undefined), false);
        this.FpsCamera.bUsePawnControlRotation = true;

        this.GunLocation.K2_SetRelativeLocationAndRotation(new UE.Vector(30, 14, -12), new UE.Rotator(0, 95, 0), false, $ref<UE.HitResult>(undefined), false);

        let ucls  = UE.Class.Load("/Game/Blueprints/TypeScript/TS_Rifle.TS_Rifle_C");
        this.EquippedGun = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(this, ucls, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, this) as TS_BaseGun;
        UE.GameplayStatics.FinishSpawningActor(this.EquippedGun, undefined);

        this.EquippedGun.K2_AttachToComponent(this.GunLocation, undefined, UE.EAttachmentRule.SnapToTarget, UE.EAttachmentRule.SnapToTarget, UE.EAttachmentRule.SnapToTarget, true);
    }
}

export default TS_Player;