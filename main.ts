import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, base64ToArrayBuffer } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

function base64_to_card_ids(b64:string) {
	let buffer = base64ToArrayBuffer(b64);
	return new Int32Array(buffer);
}

function card_id_to_html_element(card_id:number, root:HTMLElement) {
	let image = root.createEl("img");
	let image_url = "https://images.ygoprodeck.com/images/cards/" //56099748.jpg
	image.src = (image_url+card_id+".jpg");
	//image.width = ;
	image.setAttr("width","10%");
	image.setAttr("href","https://yugipedia.com/wiki/"+card_id);
}

function deck_to_table(deck:Int32Array,root:HTMLElement) {
	const table = root.createEl("table");
	const body = table.createEl("tbody");
	let split = split_array(deck,10);
	for(let i = 0;i<split.length;i++) {
		const row = body.createEl("tr");
		for (let j=0;j<split[i].length;j++)
		{
			card_id_to_html_element(split[i][j],row);
		}
	}
}

function split_array(array:Int32Array,chunkSize:number) {
	let split_array = [];
	for (let i=0;i<array.length; i+=chunkSize) {
		const chunk = array.slice(i,i+chunkSize);
		split_array.push(chunk);
	}
	return split_array;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();


		this.registerMarkdownCodeBlockProcessor("ydke", (source, el, ctx) => {
			console.log("Hello World");
			let ydke_url:string = source; // BASE64 Encoded list of card ids
			let split_url = ydke_url.split("//");
			if (split_url.length!=2) {
				console.log("Invalid YDKE URL Format");
				return;
			}
			let prefix = split_url[0];
			if (prefix!="ydke:")
			{
				console.log("YDKE URL must begin with ydke://");
				return;
			}
			let deck = split_url[1];
			let deck_split = deck.split("\!");
			if(deck_split.length!=4) {
				console.log("URL must contain Main/Extra/Side deck sections.");
				console.log(deck_split.length-1);
				return;
			}
			let main_deck_b64 = deck_split[0];
			let extra_deck_b64 = deck_split[1];
			let side_deck_b64 = deck_split[2];

			let main_deck  = base64_to_card_ids(main_deck_b64);
			let extra_deck= base64_to_card_ids(extra_deck_b64);
			let side_deck = base64_to_card_ids(side_deck_b64);
			//let image_url= "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=";
			deck_to_table(main_deck,el);
			deck_to_table(extra_deck,el);
			deck_to_table(side_deck,el);

			
		  });
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
