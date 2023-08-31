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
			let prefix = split_url[0];
			let deck = split_url[1];
			let deck_split = deck.split("\!"); 
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

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
