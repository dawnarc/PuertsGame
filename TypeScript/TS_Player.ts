
import * as UE from 'ue'
import TS_BaseGun from './TS_BaseGun'
import {$ref, $unref} from 'puerts'
import './ObjectExt' 
import {rpc, edit_on_instance} from 'ue'

function delay(t:number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t);
    });
}

class TS_Player extends UE.Character 
{
    FpsCamera: UE.CameraComponent;
    EquippedGun:TS_BaseGun;
    GunLocation:UE.SceneComponent;
    CanShoot: boolean;

    @rpc.flags(rpc.PropertyFlags.CPF_Net | rpc.PropertyFlags.CPF_RepNotify)
    @rpc.condition(rpc.ELifetimeCondition.COND_InitialOrOwner)
    ShootCounter: number;

    Constructor() 
    {
        this.bUseControllerRotationPitch = true;
        this.bUseControllerRotationYaw = true;
        this.bUseControllerRotationRoll = true;

        let FpsCamera = this.CreateDefaultSubobjectGeneric<UE.CameraComponent>("FpsCamera", UE.CameraComponent.StaticClass());
        FpsCamera.SetupAttachment(this.CapsuleComponent, "FpsCamera");
        FpsCamera.K2_SetRelativeLocationAndRotation(new UE.Vector(0, 0, 90), undefined, false, $ref<UE.HitResult>(undefined), false);
        FpsCamera.bUsePawnControlRotation = true;
        this.FpsCamera = FpsCamera;

        this.GunLocation = this.CreateDefaultSubobjectGeneric<UE.SceneComponent>("GunLocation", UE.SceneComponent.StaticClass());
        this.GunLocation.SetupAttachment(this.FpsCamera, "GunLocation");
        this.GunLocation.K2_SetRelativeLocationAndRotation(new UE.Vector(30, 14, -12), new UE.Rotator(0, 95, 0), false, $ref<UE.HitResult>(undefined), false);

        this.CanShoot = true;
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
    async AsynClientShoot(axisValue: number): Promise<void> {
        //console.log("=========== aaaaaa ", axisValue);
        if (axisValue == 1 && this.CanShoot) {
            //notify server to process shoot logic.
            this.ServerShoot();

            //client local shoot logic.
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
        this.AsynClientShoot(axisValue);
    }

    //@no-blueprint
    async ServerAsyncShoot(): Promise<void> {
        //console.log("=========== aaaaaa ", axisValue);
        if (this.CanShoot) {
            let cameraLocation = this.FpsCamera.K2_GetComponentLocation();
            let endLocation = cameraLocation.op_Addition(this.FpsCamera.GetForwardVector().op_Multiply(this.EquippedGun.MaxBulletDistance));
            this.EquippedGun.Shoot(cameraLocation, endLocation);
            this.CanShoot = false;
            await delay(this.EquippedGun.FireRate * 1000);//TODO: 支持Latent方法转async方法后，可以用KismetSystemLibrary.Delay
            this.CanShoot = true;
        }
    }

    @rpc.flags(rpc.FunctionFlags.FUNC_Net | rpc.FunctionFlags.FUNC_NetServer | rpc.FunctionFlags.FUNC_NetReliable)
    ServerShoot(): void {
        let IsServer = UE.KismetSystemLibrary.IsDedicatedServer(this);
        //console.log("======= ServerShoot", IsServer);
        this.ServerAsyncShoot();
    }

    ReceiveBeginPlay(): void 
    {
        let ucls  = UE.Class.Load("/Game/Blueprints/TypeScript/TS_Rifle.TS_Rifle_C");
        this.EquippedGun = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(this, ucls, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, this) as TS_BaseGun;
        UE.GameplayStatics.FinishSpawningActor(this.EquippedGun, undefined);
        this.EquippedGun.K2_AttachToComponent(this.GunLocation, undefined, UE.EAttachmentRule.SnapToTarget, UE.EAttachmentRule.SnapToTarget, UE.EAttachmentRule.SnapToTarget, true);
    }
}

export default TS_Player;