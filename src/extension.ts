import { ExtensionContext, commands, window, ViewColumn, WebviewPanel } from 'vscode';
import Ollama from 'ollama';


export function activate(context: ExtensionContext) {
    console.log('Extension "edna-r1" is now active!');

    const disposable = commands.registerCommand('edna-v1.helloWorld', () => {
        const panel = window.createWebviewPanel(
            'Edna-r1',
            'Edna',
            ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true  
            }
        );

     
        panel.onDidDispose(() => {
         
        }, null, context.subscriptions);

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'generate') {
                const userPrompt = message.prompt;
                let responseText = '';

                // Update status to show loading
                panel.webview.postMessage({ command: 'updateStatus', status: 'loading' });

                const systemPrompt = "You are an AI coding assistant named Edna. Answer concisely and accurately.";
                const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`;

                try {
                    const streamResponse = await Ollama.generate({
                        model: 'deepseek-r1:1.5b',
                        prompt: fullPrompt,
                        stream: true
                    });

                    for await (const part of streamResponse) {
                        responseText += part.response;
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                } catch (err) {
                    panel.webview.postMessage({
                        command: 'chatResponse',
                        text: `Error: ${err instanceof Error ? err.message : String(err)}`
                    });
                } finally {
                    // Reset status when done
                    panel.webview.postMessage({ command: 'updateStatus', status: 'ready' });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edna - DeepSeek</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0A192F;
            color: #E0E0E0;
            padding: 20px;
            text-align: center;
            margin: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        #prompt {
            width: 100%;
            min-height: 80px;
            background-color: #112240;
            border: 1px solid #1F4068;
            color: #E0E0E0;
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            margin-bottom: 10px;
            resize: vertical;
        }
        #send {
            background-color: #1F4068;
            border: none;
            color: white;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        #send:hover {
            background-color: #3A506B;
        }
        #send:disabled {
            background-color: #1F4068;
            opacity: 0.5;
            cursor: not-allowed;
        }
        #output {
            margin-top: 20px;
            padding: 15px;
            background-color: #112240;
            border-radius: 5px;
            min-height: 150px;
            width: 100%;
            border: 1px solid #1F4068;
            text-align: left;
            white-space: pre-wrap;
            box-sizing: border-box;
        }
        .loading {
            opacity: 0.7;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 3px solid #E0E0E0;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 10px auto;
        }
        .spinner.active {
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Edna-r1</h1>
        <textarea id="prompt" placeholder="Enter your prompt... (Ctrl+Enter to send)"></textarea><br>
        <button id="send">Send</button>
        <div class="spinner"></div>
        <div id="output">Generated content will appear here...</div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        const prompt = document.getElementById('prompt');
        const send = document.getElementById('send');
        const spinner = document.querySelector('.spinner');
        let isGenerating = false;

        function generateResponse() {
            if (isGenerating || !prompt.value.trim()) return;
            
            isGenerating = true;
            send.disabled = true;
            spinner.classList.add('active');
            vscode.postMessage({ command: 'generate', prompt: prompt.value });
        }

        send.addEventListener('click', generateResponse);

        prompt.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                generateResponse();
            }
        });

        window.addEventListener('message', event => {
            const { command, text, status } = event.data;
            
            if (command === 'chatResponse') {
                document.getElementById('output').innerText = text;
            }
            else if (command === 'updateStatus') {
                if (status === 'ready') {
                    isGenerating = false;
                    send.disabled = false;
                    spinner.classList.remove('active');
                }
            }
        });
    </script>
</body>
</html>`;
}

export function deactivate() {}
