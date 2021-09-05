/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import RandomIdeaGenerator from './random-idea-generator'
import StickyNote from './sticky-note';
import Thing from './thing';
import fs from 'fs';

import util from 'util';
import AppEnvironment from './env';
// import PaintCan from './paint-can';

const readdir = util.promisify(fs.readdir);

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	private text: MRE.Actor = null;
	private cube: MRE.Actor = null;
	private assets: MRE.AssetContainer;

	constructor(private context: MRE.Context) {
		this.assets = new MRE.AssetContainer(context);
		this.context.onStarted(() => this.started());
		
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {
		MRE.log.info("app", "ID: "+this.context.sessionId);

		const container = new MRE.AssetContainer(this.context);

		const env = new AppEnvironment();
		// const paints = [
		// 	container.createMaterial("blue", {color:{r:0,g:0,b:1}}),
		// 	container.createMaterial("red", {color:{r:1,g:0,b:0}}),
		// ];

		const simple_models_folder = 'simple-models';
		const model_files = await readdir(`./public/${simple_models_folder}`);

		const models = await Promise.all(model_files.map(fname=> this.assets.loadGltf(`${simple_models_folder}/${fname}`,'mesh').then(assets=>assets.find(a=>a.prefab!==null) as MRE.Prefab)));
		const table_model = await this.assets.loadGltf('long-table.glb','mesh').then(assets=>assets.find(a=>a.prefab!==null) as MRE.Prefab);
		
        const table = MRE.Actor.CreateFromPrefab(this.context, {
            prefab: table_model,    
            actor: {
				transform: {
					local: {
						position: {y:-1},
                    }
                },
            }
        });

		// const paint_can = await this.assets.loadGltf('paint-bucket.glb','mesh').then(assets=>assets.find(a=>a.prefab!==null) as MRE.Prefab);

		// paints.forEach((value,index,array) => new PaintCan(this.context,env,value,paint_can,{x:0.5,y:0,z:-0.2*index}));
		
		let inc = 0.2;
		let mn = (models.length-1)*0.5 * inc;
		
		for(let i = 0; i < models.length;i++) {
			let mu = new Thing(this.context,env,models[i],{x:0, y:0, z:mn -inc * i});
		}

		let sn_mat = container.createMaterial("sticky-note-mat", {color: {r:1,g:1,b:0.6}});
		
		let sn = new StickyNote(this.context, sn_mat, {x: 0,y:0, z:1.5});

		let rig = new RandomIdeaGenerator(this.context, sn_mat, {x: 0, y: 0, z: 1.8})
	}
}
