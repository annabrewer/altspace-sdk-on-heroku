
// import * as MRE from '@microsoft/mixed-reality-extension-sdk';
// import { Appearance, AppearanceLike, Material, MreArgumentError, Quaternion } from '@microsoft/mixed-reality-extension-sdk';
// import AppEnvironment from './env';

// export default class PaintCan {

//     constructor(private context: MRE.Context, private env: AppEnvironment, private material: Material, prefab: MRE.Prefab, position: Partial<MRE.Vector3Like>) {
//         const self = this;
//         const vis = MRE.Actor.CreateFromPrefab(this.context, {
//             prefab: prefab,
//             actor: {
//                 name: self.material.name,
//                 transform: {
//                     local: {
//                         position: position,
//                         rotation: Quaternion.RotationYawPitchRoll(0, Math.PI / 2.0, 0),
//                         scale: { x: 0.25, y: 0.25, z: 0.25 }
//                     }
//                 },
//                 appearance: {
//                     materialId: self.material.id,
//                 },
//                 collider: { geometry: { shape: MRE.ColliderType.Capsule }, enabled: true, },
//                 rigidBody: { useGravity: false, isKinematic: true }
//             }
//         });

//         vis.collider.isTrigger = true;

//         vis.collider.onTrigger("trigger-enter", other => {
//             MRE.log.info("app", `collide ${vis.name} ${other.name}@${other.id}`);

//             while (other !== null && !self.env.paintTargets.has(other.id)) {
//                 MRE.log.info("app", `not in`);// ${Array.from(self.env.paintTargets.keys()).map(k=>k.toString()).join(' ')}`);
//                 other = other.parent;

//                 if (other === null) {
//                     MRE.log.info("app", "done");
//                     return;
//                 } else {
//                     MRE.log.info("app", `--> ${other.id}`);
//                 }

//             }
//             MRE.log.info("app", "is paint target!");
//             const target = self.env.paintTargets.get(other.id);

//             this.dmatRec(target);
//         });
//     }
//     dmatRec(target: MRE.Actor) {
//         const self = this;
//         MRE.log.info("app", `dmatrec ${target.name} @ ${target.id}`);
//         let k = target.appearance;
//         try {
//             if (k !== null && k !== undefined) {
//                 k.material = this.material;
//                 target.appearance = k;
//             }
//         } catch (err) {
//             MRE.log.info("app", `issue ${target.appearance}`);
//             MRE.log.info("app", `issue ${target.appearance.material}`);
//         }
//         target.children.forEach(self.dmatRec);
//     }
// }