# Obsidian Ollama AI Plugin

## Plugin Name: **Obsidian Ollama AI**

The **Ollama Enhance** plugin integrates the power of Ollama's AI models directly into Obsidian, providing a seamless way to enhance your notes and writing process. Whether you need help expanding on ideas, improving the quality of your text, or creating internal links for concepts, this plugin brings the capabilities of Ollama AI to your fingertips within the Obsidian environment.

### Features

- **Expand Highlighted Text**: Automatically expand your highlighted text to add more details and clarity.
- **Answer Highlighted Question**: Get direct answers to questions you highlight in your notes.
- **Improve Highlighted Text**: Enhance the quality of your writing with AI-driven improvements.
- **Make Text Concise**: Summarize or shorten your highlighted text to make it more concise.
- **Summarize Highlighted Text**: Quickly generate a summary for the highlighted section.
- **Obsidian Smart Link**: Identify key concepts, places, people, and things in your highlighted text and wrap them in double brackets (`[[ ]]`) to create links within Obsidian.

### Installation
1. Clone or download this plugin into your Obsidian vault's `.obsidian/plugins` directory.
2. Run `npm install` in the plugin directory to install dependencies.
3. Compile the plugin using `tsc` (TypeScript compiler).
4. Open Obsidian, navigate to **Settings** > **Community Plugins**, and enable the **Ollama Enhance** plugin.

### Configuration
To configure the Ollama Enhance plugin, navigate to **Settings** > **Ollama Enhance**:

- **Ollama Instance URL**: Set the URL of your local Ollama instance. This should be in the format `http://localhost:11434`.
- **Ollama Model**: Select the model to use. Available models are fetched automatically from your Ollama instance.

### Usage
To use the plugin, highlight any text in your Obsidian note and execute one of the available commands via the Command Palette (`Ctrl/Cmd + P`) or set custom hotkeys for quick access.

- **Expand**: Expands on the highlighted text, adding more information and clarity.
- **Answer**: Provides a direct answer to a highlighted question.
- **Improve**: Improves the quality and flow of the highlighted text.
- **Concise**: Makes the highlighted text shorter while retaining its meaning.
- **Summarize**: Summarizes the key points of the highlighted text.
- **Smart Link**: Detects key concepts, places, people, and things and wraps them in `[[ ]]` to create Obsidian links for easy navigation.

### Example Prompts
- **Expand**: "Expand the following text: \n\n"Your highlighted text""
- **Improve**: "Improve the following text: \n\n"Your highlighted text""
- **Summarize**: "Summarize the following text: \n\n"Your highlighted text""
- **Smart Link**: "Identify key concepts, places, people, and things and wrap them in double brackets."

### Troubleshooting
- **Invalid JSON Response**: If you encounter a `SyntaxError` while parsing the response, please ensure that your Ollama instance is running properly and returning valid JSON responses.
- **Empty Response**: If the AI response is empty, try adjusting your highlighted text or verifying the connection to your Ollama instance.

### Requirements
- A running instance of Ollama AI locally.
- Obsidian version 0.12.0 or higher.

### Contribution
Feel free to contribute by submitting issues, feature requests, or pull requests on GitHub. We welcome improvements and suggestions to enhance the plugin.

### License
This plugin is open-source and available under the MIT License.

