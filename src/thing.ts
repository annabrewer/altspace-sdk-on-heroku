
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Quaternion } from '@microsoft/mixed-reality-extension-sdk';
import AppEnvironment from './env';

export default class Thing {
    private actor: MRE.Actor;
    private didClone = false;

    constructor(private context: MRE.Context, private env: AppEnvironment, private prefab: MRE.Prefab, position: Partial<MRE.Vector3Like>) {
        const self = this;

        let pivot = MRE.Actor.Create(this.context, {
            actor: {
                transform: {
                    local: { position: position }
                }
            }
        });

        pivot.grabbable = true;

        this.actor = MRE.Actor.CreateFromPrefab(this.context, {
            prefab: this.prefab,    
            actor: {
                name: prefab.name,
                parentId: pivot.id,
                transform: {
                    local: {
                        rotation: Quaternion.RotationYawPitchRoll(Math.PI, Math.PI / 2.0, 0),
                        scale: { x: 0.25, y: 0.25, z: 0.25 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto }, enabled: true, },
            }
        });

        // MRE.log.info("app",`Add target ${this.actor.name} @ ${this.actor.id}`);
        // env.paintTargets.set(this.actor.id,this.actor);

        pivot.onGrab("begin", () => {
            if (this.didClone) return;
            new Thing(self.context, self.env, self.prefab, pivot.transform.local.position);
            this.didClone = true;
        });

    }
}