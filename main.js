"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Obsidian Plugin: AI Integration with Local Ollama Instance
var obsidian_1 = require("obsidian");
var DEFAULT_SETTINGS = {
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: ''
};
var OllamaPlugin = /** @class */ (function (_super) {
    __extends(OllamaPlugin, _super);
    function OllamaPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.settings = DEFAULT_SETTINGS;
        _this.ghostTextDiv = null;
        return _this;
    }
    OllamaPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new OllamaSettingTab(this.app, this));
                        this.addCommand({
                            id: 'ollama-expand',
                            name: 'Expand Highlighted Text',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'expand'); }
                        });
                        this.addCommand({
                            id: 'ollama-complete',
                            name: 'Complete the Sentence',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'complete'); }
                        });
                        this.addCommand({
                            id: 'ollama-answer',
                            name: 'Answer Highlighted Question',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'answer'); }
                        });
                        this.addCommand({
                            id: 'ollama-improve',
                            name: 'Improve Highlighted Text',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'improve'); }
                        });
                        this.addCommand({
                            id: 'ollama-concise',
                            name: 'Make Text Concise',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'concise'); }
                        });
                        this.addCommand({
                            id: 'ollama-summarize',
                            name: 'Summarize Highlighted Text',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'summarize'); }
                        });
                        this.addCommand({
                            id: 'ollama-smart-link',
                            name: 'Obsidian Smart Link',
                            editorCallback: function (editor) { return _this.handleAIAction(editor, 'smart-link'); }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    OllamaPlugin.prototype.handleAIAction = function (editor, action) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedText, cursorPos, prompt, response, responseText, data, aiResponse, lastMatched, word, index, matchedIndex, matchText, matchResponse, goodResponse, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        selectedText = '';
                        cursorPos = editor.getCursor();
                        if (editor.somethingSelected()) {
                            selectedText = editor.getSelection();
                        }
                        else {
                            selectedText = editor.getRange({ line: cursorPos.line, ch: 0 }, cursorPos);
                        }
                        prompt = '';
                        switch (action) {
                            case 'expand':
                                prompt = "Expand the following text:\n\n\"".concat(selectedText, "\"\n\nReturn only the expanded content without any additional explanation in markdown format.");
                                break;
                            case 'complete':
                                prompt = "Complete the following sentence without adding any additional instructions or explanations: \"".concat(selectedText, "\"");
                                break;
                            case 'improve':
                                prompt = "Improve the following text:\n\n\"".concat(selectedText, "\"\n\nReturn only the improved content without any additional explanation in markdown format.");
                                break;
                            case 'summarize':
                                prompt = "Summarize the following text:\n\n\"".concat(selectedText, "\"\n\nReturn only the summary without any additional explanation in markdown format.");
                                break;
                            case 'answer':
                                prompt = "Answer the following question:\n\n\"".concat(selectedText, "\"\n\nReturn only the answer without any additional explanation in markdown format.");
                                break;
                            case 'concise':
                                prompt = "Make the following text more concise:\n\n\"".concat(selectedText, "\"\n\nReturn only the concise version without any additional explanation in markdown format.");
                                break;
                            case 'smart-link':
                                prompt = "Identify the key concepts, places, people, and things in the following text and wrap them in double brackets like [[Concept]] to create Obsidian links for those ideas:\"".concat(selectedText, "\"Return only the modified text with double bracketed key concepts, places, people, and things in markdown format.");
                                break;
                            default:
                                console.error('Unknown action:', action);
                                return [2 /*return*/];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("".concat((_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.ollamaUrl) !== null && _b !== void 0 ? _b : '', "/api/generate"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: (_d = (_c = this.settings) === null || _c === void 0 ? void 0 : _c.ollamaModel) !== null && _d !== void 0 ? _d : 'llama3.1',
                                    prompt: prompt,
                                    stream: false
                                })
                            })];
                    case 2:
                        response = _e.sent();
                        if (!response.ok) {
                            throw new Error("Failed to communicate with the Ollama API. Status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.text()];
                    case 3:
                        responseText = _e.sent();
                        data = void 0;
                        try {
                            data = JSON.parse(responseText);
                        }
                        catch (parseError) {
                            console.error('Failed to parse Ollama response:', parseError);
                            new obsidian_1.Notice('Failed to parse the response from Ollama. Please ensure the server is returning valid JSON.');
                            return [2 /*return*/];
                        }
                        aiResponse = data.response.replace(/^"|"$/g, '').trim();
                        if (!aiResponse || aiResponse.length === 0) {
                            new obsidian_1.Notice('AI response is empty. Please try again.');
                            return [2 /*return*/];
                        }
                        if (action !== "complete") {
                            this.showResponseOptions(editor, selectedText, aiResponse);
                        }
                        else {
                            if (!editor.somethingSelected()) {
                                lastMatched = null;
                                word = '';
                                for (index = 0; index < aiResponse.length; index++) {
                                    word += aiResponse[index];
                                    matchedIndex = selectedText.indexOf(word);
                                    if (matchedIndex !== -1) {
                                        lastMatched = matchedIndex;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                if (lastMatched !== null) {
                                    new obsidian_1.Notice('Matched from the middle of the line. Replacing the text from the middle.');
                                    editor.replaceRange(aiResponse, {
                                        line: cursorPos.line,
                                        ch: lastMatched
                                    }, editor.getCursor());
                                }
                                else {
                                    // nothing matched. Just append the response
                                    editor.setValue(editor.getValue() + aiResponse);
                                }
                            }
                            else {
                                matchText = selectedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
                                matchResponse = aiResponse.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
                                goodResponse = matchResponse.startsWith(matchText) ? aiResponse : false;
                                if (goodResponse) {
                                    editor.replaceSelection(goodResponse !== null && goodResponse !== void 0 ? goodResponse : '');
                                }
                                else {
                                    new obsidian_1.Notice(aiResponse);
                                    return [2 /*return*/];
                                }
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _e.sent();
                        console.error('Ollama request failed:', error_1);
                        new obsidian_1.Notice('Failed to connect to Ollama. Please check your settings.');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OllamaPlugin.prototype.showGhostText = function (suggestion, editor) {
        var cursor = editor.getCursor();
        if (!this.ghostTextDiv) {
            this.ghostTextDiv = document.createElement("div");
            this.ghostTextDiv.className = "ghost-text";
            this.ghostTextDiv.style.position = "absolute";
            this.ghostTextDiv.style.opacity = "0.5"; // Ghostly appearance
            this.ghostTextDiv.style.pointerEvents = "none"; // Avoid interference with clicks
            this.ghostTextDiv.style.color = "#AAA"; // Light gray color for ghost text
            document.body.appendChild(this.ghostTextDiv);
        }
        // Set the suggestion text
        this.ghostTextDiv.textContent = suggestion;
        // Position the ghost text div near the cursor
        // @ts-ignore 
        var cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(cursor));
        this.ghostTextDiv.style.top = "".concat(cursorCoords.top, "px");
        this.ghostTextDiv.style.left = "".concat(cursorCoords.left, "px");
    };
    OllamaPlugin.prototype.hideGhostText = function () {
        if (this.ghostTextDiv) {
            this.ghostTextDiv.remove();
            this.ghostTextDiv = null;
        }
    };
    OllamaPlugin.prototype.showResponseOptions = function (editor, originalText, aiResponse) {
        var modal = new OllamaResponseModal(this.app, aiResponse, function (action) {
            if (action === 'replace') {
                editor.replaceSelection(aiResponse !== null && aiResponse !== void 0 ? aiResponse : '');
            }
            else if (action === 'append') {
                editor.replaceSelection("".concat(originalText, " ").concat(aiResponse));
            }
            else if (action === 'copy') {
                navigator.clipboard.writeText(aiResponse).then(function () { return new obsidian_1.Notice('Copied to clipboard.'); });
            }
        });
        modal.open();
    };
    OllamaPlugin.prototype.onunload = function () {
        console.log('Unloading Ollama Plugin');
    };
    OllamaPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    OllamaPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OllamaPlugin;
}(obsidian_1.Plugin));
exports.default = OllamaPlugin;
var OllamaSettingTab = /** @class */ (function (_super) {
    __extends(OllamaSettingTab, _super);
    function OllamaSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    OllamaSettingTab.prototype.display = function () {
        return __awaiter(this, void 0, void 0, function () {
            var containerEl;
            var _this = this;
            return __generator(this, function (_a) {
                containerEl = this.containerEl;
                containerEl.empty();
                containerEl.createEl('h2', { text: 'Ollama Plugin Settings' });
                new obsidian_1.Setting(containerEl)
                    .setName('Ollama Instance URL')
                    .setDesc('Enter the URL of your local Ollama instance')
                    .addText(function (text) {
                    var _a, _b;
                    return text
                        .setPlaceholder('http://localhost:11434')
                        .setValue((_b = (_a = _this.plugin.settings) === null || _a === void 0 ? void 0 : _a.ollamaUrl) !== null && _b !== void 0 ? _b : '')
                        .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.plugin.settings.ollamaUrl = value;
                                    return [4 /*yield*/, this.plugin.saveSettings()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                new obsidian_1.Setting(containerEl)
                    .setName('Ollama Model')
                    .setDesc('Select the model to use with Ollama')
                    .addDropdown(function (dropdown) { return __awaiter(_this, void 0, void 0, function () {
                    var response, data, models, error_2;
                    var _this = this;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, fetch("".concat(this.plugin.settings.ollamaUrl, "/api/tags"), {
                                        method: 'GET'
                                    })];
                            case 1:
                                response = _c.sent();
                                if (!response.ok) {
                                    throw new Error('Failed to fetch models');
                                }
                                return [4 /*yield*/, response.json()];
                            case 2:
                                data = _c.sent();
                                models = data.models;
                                models.forEach(function (model) {
                                    dropdown.addOption(model.name, model.name);
                                });
                                dropdown.setValue((_b = (_a = this.plugin.settings) === null || _a === void 0 ? void 0 : _a.ollamaModel) !== null && _b !== void 0 ? _b : '');
                                dropdown.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                this.plugin.settings.ollamaModel = value;
                                                return [4 /*yield*/, this.plugin.saveSettings()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _c.sent();
                                console.error('Failed to fetch models from Ollama:', error_2);
                                new obsidian_1.Notice('Failed to fetch models from Ollama. Please check the URL and try again.');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return OllamaSettingTab;
}(obsidian_1.PluginSettingTab));
var OllamaResponseModal = /** @class */ (function (_super) {
    __extends(OllamaResponseModal, _super);
    function OllamaResponseModal(app, response, onAction) {
        var _this = _super.call(this, app) || this;
        _this.response = response;
        _this.onAction = onAction;
        return _this;
    }
    OllamaResponseModal.prototype.onOpen = function () {
        var _this = this;
        var contentEl = this.contentEl;
        contentEl.createEl('h2', { text: 'AI Response Preview' });
        contentEl.createEl('p', { text: this.response });
        new obsidian_1.Setting(contentEl)
            .addButton(function (button) { return button
            .setButtonText('Replace')
            .onClick(function () {
            _this.onAction('replace');
            _this.close();
        }); });
        new obsidian_1.Setting(contentEl)
            .addButton(function (button) { return button
            .setButtonText('Append')
            .onClick(function () {
            _this.onAction('append');
            _this.close();
        }); });
        new obsidian_1.Setting(contentEl)
            .addButton(function (button) { return button
            .setButtonText('Copy')
            .onClick(function () {
            _this.onAction('copy');
            _this.close();
        }); });
    };
    OllamaResponseModal.prototype.onClose = function () {
        var contentEl = this.contentEl;
        contentEl.empty();
    };
    return OllamaResponseModal;
}(obsidian_1.Modal));
