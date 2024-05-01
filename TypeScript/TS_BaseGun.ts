import * as UE from 'ue'
import {$ref, $unref} from 'puerts'

class TS_BaseGun extends UE.Actor 
{
    MaxBulletDistance: number;
    Damage: number;
    FireRate: number;
    GunMesh: UE.StaticMeshComponent;
    PS_BulletImpact: UE.ParticleSystem;

    Constructor() 
    {}

    ReceiveBeginPlay(): void 
    {
        //console.log("==== BaseGun ReceiveBeginPlay");
        this.PS_BulletImpact = UE.ParticleSystem.Load("/Game/BlockBreaker/ParticleSystems/PS_BulletImpact");
    }
    
    //@no-blueprint
    Shoot(StartLocation: UE.Vector, EndLocation: UE.Vector): void 
    {
        //console.log("========= qqqq 555", StartLocation.ToString())
        let hitResultOut = $ref<UE.HitResult>(undefined);
        //if (UE.KismetSystemLibrary.LineTraceSingle(this, StartLocation, EndLocation, 0, false, undefined, 0, hitResultOut, true, undefined, undefined, 0)) 
        if(UE.GameplayHelper.LineTrace(this, StartLocation, EndLocation, UE.ECollisionChannel.ECC_Visibility, hitResultOut))
        {
            let hitResult = $unref(hitResultOut);
            UE.GameplayStatics.SpawnEmitterAtLocation(this, this.PS_BulletImpact, hitResult.Location, new UE.Rotator(0, 0, 0), new UE.Vector(1, 1, 1), true, UE.EPSCPoolMethod.AutoRelease, true);

            if (hitResult.Actor) 
            {
                UE.GameplayStatics.ApplyDamage(hitResult.Actor, this.Damage, undefined, undefined, undefined);
            }
        }
    }
}

export default TS_BaseGun;