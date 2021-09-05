
import * as MRE from '@microsoft/mixed-reality-extension-sdk';

export default class RandomIdeaGenerator {
    private isWriting = false;
    private didSaveOnce = false;
    private didSetup = false;
    private actor: MRE.Actor;
    private text: MRE.Actor = null;
    private didClone = false;
    private adjectives = ['collaborative', 'competitive', 'crowdsourced', 'meta', 'asymmetric']
    private activities = ['art gallery', 'improv performance', 'card game', 'sculpture', 'DJ set', 'dress-up party', 'food fight', 'escape room']
    private environments = ['in space', 'in the jungle', 'in zero-g']
    
    handler(user: MRE.User) {
        /*if (this.isWriting) return;
        this.isWriting = true;
        user.prompt("Enter text", true).then(response => {
            this.isWriting = false;
            if (!response.submitted) return;
            this.didSaveOnce = true;
            this.text.text.contents = response.text;
            this.text.text.height = 0.28 / response.text.length;
            MRE.log.info("app", `Wrote sticky note? ${response.submitted} : ${response.text}`);
        })*/
        let random1 = this.getRandomInt(this.adjectives.length)
        let random2 = this.getRandomInt(this.activities.length)
        let random3 = this.getRandomInt(this.environments.length)
        this.text.text.contents = this.adjectives[random1] + ' ' + this.activities[random2] + ' ' + this.environments[random3]
    }

    getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    constructor(private context: MRE.Context, material: MRE.Material, position: Partial<MRE.Vector3Like>) {
        const self = this;

        this.actor = MRE.Actor.CreatePrimitive(new MRE.AssetContainer(this.context), {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: 0.16, y: 0.32, z: 0.01 },
            },
            actor: {
                name: 'StickyNote',
                transform: {
                    local: {
                        position: position,
                    }
                },
                appearance: {
                    materialId: material.id,
                }
            },
            addCollider: true
        });

        this.text = MRE.Actor.Create(this.context, {
            actor: {
                parentId: this.actor.id,
                name: 'Text',
                transform: {
                    local: { position: { x: 0, y: 0, z: -0.01 } }
                },
                text: {
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    color: { r: 0, g: 0, b: 0 },
                    height: 0.28,
                    font: MRE.TextFontFamily.Monospace,
                }
            }
        });


        this.actor.grabbable = true;

        this.actor.onGrab("begin", () => {
            if(this.didClone) return;
            new RandomIdeaGenerator(self.context,material,self.actor.transform.local.position);
            this.didClone=true;
        });

        this.actor.onGrab("end", (user, _) => {
            if (!this.didSaveOnce) {
                this.handler(user);
            }
            if(!this.didSetup) {
                this.didSetup=true;
                const button = this.actor.setBehavior(MRE.ButtonBehavior);
                button.onClick(user=>this.handler(user));
            }
        });
    }
}