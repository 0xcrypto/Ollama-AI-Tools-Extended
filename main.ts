// Obsidian Plugin: AI Integration with Local Ollama Instance
import { Plugin, PluginSettingTab, Setting, Notice, MarkdownView, Editor, Modal, App } from 'obsidian';

interface OllamaPluginSettings {
    ollamaUrl: string;
    ollamaModel: string;
}

const DEFAULT_SETTINGS: OllamaPluginSettings = {
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: ''
};

export default class OllamaPlugin extends Plugin {
    settings: OllamaPluginSettings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new OllamaSettingTab(this.app, this));

        this.addCommand({
            id: 'ollama-expand',
            name: 'Expand Highlighted Text',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'expand')
        });
        this.addCommand({
            id: 'ollama-answer',
            name: 'Answer Highlighted Question',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'answer')
        });
        this.addCommand({
            id: 'ollama-improve',
            name: 'Improve Highlighted Text',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'improve')
        });
        this.addCommand({
            id: 'ollama-concise',
            name: 'Make Text Concise',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'concise')
        });
        this.addCommand({
            id: 'ollama-summarize',
            name: 'Summarize Highlighted Text',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'summarize')
        });
        this.addCommand({
            id: 'ollama-smart-link',
            name: 'Obsidian Smart Link',
            editorCallback: (editor: Editor) => this.handleAIAction(editor, 'smart-link')
        });
    }

    async handleAIAction(editor: Editor, action: string) {
        const selectedText = editor.getSelection();
        if (!selectedText) {
            new Notice('Please highlight some text first.');
            return;
        }

        let prompt = '';
        switch (action) {
            case 'expand':
                prompt = `Expand the following text:\n\n"${selectedText}"\n\nReturn only the expanded content without any additional explanation in markdown format.`;
                break;
            case 'improve':
                prompt = `Improve the following text:\n\n"${selectedText}"\n\nReturn only the improved content without any additional explanation in markdown format.`;
                break;
            case 'summarize':
                prompt = `Summarize the following text:\n\n"${selectedText}"\n\nReturn only the summary without any additional explanation in markdown format.`;
                break;
            case 'answer':
                prompt = `Answer the following question:\n\n"${selectedText}"\n\nReturn only the answer without any additional explanation in markdown format.`;
                break;
            case 'concise':
                prompt = `Make the following text more concise:\n\n"${selectedText}"\n\nReturn only the concise version without any additional explanation in markdown format.`;
                break;
            case 'smart-link':
                prompt = `Identify the key concepts, places, people, and things in the following text and wrap them in double brackets like [[Concept]] to create Obsidian links for those ideas:"${selectedText}"Return only the modified text with double bracketed key concepts, places, people, and things in markdown format.`;
                break;
            default:
                console.error('Unknown action:', action);
                return;
        }

        try {
            const response = await fetch(`${this.settings?.ollamaUrl ?? ''}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: this.settings?.ollamaModel ?? 'llama3.1',
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to communicate with the Ollama API. Status: ${response.status}`);
            }

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse Ollama response:', parseError);
                new Notice('Failed to parse the response from Ollama. Please ensure the server is returning valid JSON.');
                return;
            }
            const aiResponse = data.response;
            if (!aiResponse || aiResponse.length === 0) {
                new Notice('AI response is empty. Please try again.');
                return;
            }
            this.showResponseOptions(editor, selectedText, aiResponse);
        } catch (error) {
            console.error('Ollama request failed:', error);
            new Notice('Failed to connect to Ollama. Please check your settings.');
        }
    }

    showResponseOptions(editor: Editor, originalText: string, aiResponse: string) {
        const modal = new OllamaResponseModal(this.app, aiResponse, (action) => {
            if (action === 'replace') {
                editor.replaceSelection(aiResponse ?? '');
            } else if (action === 'append') {
                editor.replaceSelection(`${originalText} ${aiResponse}`);
            } else if (action === 'copy') {
                navigator.clipboard.writeText(aiResponse).then(() => new Notice('Copied to clipboard.'));
            }
        });
        modal.open();
    }

    onunload() {
        console.log('Unloading Ollama Plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class OllamaSettingTab extends PluginSettingTab {
    plugin: OllamaPlugin;

    constructor(app: App, plugin: OllamaPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async display(): Promise<void> {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Ollama Plugin Settings' });

        new Setting(containerEl)
            .setName('Ollama Instance URL')
            .setDesc('Enter the URL of your local Ollama instance')
            .addText(text => text
                .setPlaceholder('http://localhost:11434')
                .setValue(this.plugin.settings?.ollamaUrl ?? '')
                .onChange(async (value) => {
                    this.plugin.settings.ollamaUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Ollama Model')
            .setDesc('Select the model to use with Ollama')
            .addDropdown(async (dropdown) => {
                try {
                    const response = await fetch(`${this.plugin.settings.ollamaUrl}/api/tags`, {
                        method: 'GET'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch models');
                    }

                    const data = await response.json();
                    const models = data.models;
                    models.forEach((model: { name: string }) => {
                        dropdown.addOption(model.name, model.name);
                    });
                    dropdown.setValue(this.plugin.settings?.ollamaModel ?? '');
                    dropdown.onChange(async (value) => {
                        this.plugin.settings.ollamaModel = value;
                        await this.plugin.saveSettings();
                    });
                } catch (error) {
                    console.error('Failed to fetch models from Ollama:', error);
                    new Notice('Failed to fetch models from Ollama. Please check the URL and try again.');
                }
            });
    }
}

class OllamaResponseModal extends Modal {
    response: string;
    onAction: (action: 'replace' | 'append' | 'copy') => void;

    constructor(app: App, response: string, onAction: (action: 'replace' | 'append' | 'copy') => void) {
        super(app);
        this.response = response;
        this.onAction = onAction;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'AI Response Preview' });
        contentEl.createEl('p', { text: this.response });

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Replace')
                .onClick(() => {
                    this.onAction('replace');
                    this.close();
                }));
        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Append')
                .onClick(() => {
                    this.onAction('append');
                    this.close();
                }));
        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Copy')
                .onClick(() => {
                    this.onAction('copy');
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
