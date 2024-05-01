
import * as UE from 'ue'
import {$ref, $unref} from 'puerts'
import {uproperty} from 'ue'
import {rpc, edit_on_instance} from 'ue'

import './ObjectExt' 
import TS_BaseGun from './TS_BaseGun'

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

    @rpc.flags(rpc.PropertyFlags.CPF_Net | rpc.PropertyFlags.CPF_RepNotify)
    @rpc.condition(rpc.ELifetimeCondition.COND_InitialOrOwner)
    ShootCounter: number;

    Constructor() 
    {
        this.CanShoot = true;

        this.bUseControllerRotationPitch = true;
        this.bUseControllerRotationYaw = true;
        this.bUseControllerRotationRoll = true;
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
    async AsynClientShoot(): Promise<void> {
        if (this.CanShoot)
        {
            let IsClient = !UE.KismetSystemLibrary.IsServer(this);
            console.log("===== IsClient", IsClient);

            //notify server to process shoot logic.
            this.ServerShoot();

            this.ShootInner();

            let str = "=== shooter counter:" + this.ShootCounter;
            UE.KismetSystemLibrary.PrintString(this, str);
        }
    }

    async ShootInner(): Promise<void>
    {
        let cameraLocation = this.FpsCamera.K2_GetComponentLocation();
        let endLocation = cameraLocation.op_Addition(this.FpsCamera.GetForwardVector().op_Multiply(this.EquippedGun.MaxBulletDistance));
        this.EquippedGun.Shoot(cameraLocation, endLocation);
        this.CanShoot = false;
        await delay(this.EquippedGun.FireRate * 1000);//TODO: 支持Latent方法转async方法后，可以用KismetSystemLibrary.Delay
        this.CanShoot = true;
    }
    
    Shoot(axisValue: number): void 
    {
        //console.log("====== aaaa ", axisValue);
        if(axisValue == 1)
        {
            this.AsynClientShoot();
        }
    }

    //@no-blueprint
    async ServerAsyncShoot(): Promise<void> {
        if (this.CanShoot)
        {
            this.ShootInner();
        }
    }

    @rpc.flags(rpc.FunctionFlags.FUNC_Net | rpc.FunctionFlags.FUNC_NetServer | rpc.FunctionFlags.FUNC_NetReliable)
    ServerShoot(): void {
        let IsServer = UE.KismetSystemLibrary.IsDedicatedServer(this);
        console.log("===== IsServer", IsServer);
        this.ServerAsyncShoot();

        this.ShootCounter++;
    }

    ReceiveBeginPlay(): void 
    {
        super.ReceiveBeginPlay();
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