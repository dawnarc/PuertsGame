import TS_BaseGun from './TS_BaseGun'
import * as UE from 'ue'

class TS_Rifle extends TS_BaseGun 
{
    Constructor() 
    {
        this.MaxBulletDistance = 5000;
        this.Damage = 2;
        this.FireRate = 0.1;
    }

    ReceiveBeginPlay(): void 
    {
        //console.log("==== Refile ReceiveBeginPlay");
        this.GunMesh.StaticMesh = UE.StaticMesh.Load("/Game/BlockBreaker/Meshes/SM_Rifle");
        super.ReceiveBeginPlay();
    }
}

export default TS_Rifle;