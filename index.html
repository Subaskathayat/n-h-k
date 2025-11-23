<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenRouter API Tester</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #2c3e50;
        }
        
        input[type="text"],
        textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            margin-bottom: 15px;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus,
        textarea:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.3s;
            width: 100%;
            margin-bottom: 20px;
        }
        
        button:hover {
            background-color: #2980b9;
        }
        
        button:disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
        }
        
        #response {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            min-height: 100px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .loading {
            text-align: center;
            margin: 10px 0;
            display: none;
        }
        
        .loading:after {
            content: '⏳';
            animation: loading 1s infinite;
            font-size: 24px;
            display: inline-block;
        }
        
        @keyframes loading {
            0% { content: '⏳'; }
            33% { content: '⌛'; }
            66% { content: '⏳'; }
        }
        
        .api-key-container {
            margin-bottom: 20px;
        }
        
        .api-key-input {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #7f8c8d;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OpenRouter API Tester</h1>
        
        <div class="api-key-container">
            <label for="apiKey">OpenRouter API Key:</label>
            <div class="api-key-input">
                <input type="password" id="apiKey" placeholder="Enter your OpenRouter API key">
                <button class="toggle-password" onclick="togglePasswordVisibility()">👁️</button>
            </div>
        </div>
        
        <div class="input-group">
            <label for="prompt">Enter your prompt:</label>
            <textarea id="prompt" placeholder="Type your message here...">Tell me a short joke</textarea>
        </div>
        
        <button id="submitBtn">Send to OpenRouter</button>
        
        <div class="loading" id="loading">Processing your request...</div>
        
        <div class="input-group">
            <label for="response">Response:</label>
            <div id="response">Response will appear here...</div>
        </div>
    </div>

    <script>
        // Toggle password visibility
        function togglePasswordVisibility() {
            const apiKeyInput = document.getElementById('apiKey');
            const toggleBtn = document.querySelector('.toggle-password');
            
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                toggleBtn.textContent = '👁️';
            } else {
                apiKeyInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }

        // Handle form submission
        document.getElementById('submitBtn').addEventListener('click', async () => {
            const apiKey = document.getElementById('apiKey').value.trim();
            const prompt = document.getElementById('prompt').value.trim();
            const responseDiv = document.getElementById('response');
            const loading = document.getElementById('loading');
            const submitBtn = document.getElementById('submitBtn');
            
            if (!apiKey) {
                alert('Please enter your OpenRouter API key');
                return;
            }
            
            if (!prompt) {
                alert('Please enter a prompt');
                return;
            }
            
            try {
                // Disable button and show loading
                submitBtn.disabled = true;
                loading.style.display = 'block';
                responseDiv.textContent = 'Sending request...';
                
                // Make API call to OpenRouter
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'OpenRouter API Tester'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-3.5-turbo',
                        messages: [
                            { role: 'user', content: prompt }
                        ]
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Display the response in a readable format
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    responseDiv.textContent = data.choices[0].message.content;
                } else {
                    responseDiv.textContent = JSON.stringify(data, null, 2);
                }
                
            } catch (error) {
                console.error('Error:', error);
                responseDiv.textContent = `Error: ${error.message}\n\nPlease check your API key and try again.`;
            } finally {
                // Re-enable button and hide loading
                submitBtn.disabled = false;
                loading.style.display = 'none';
            }
        });

        // Allow pressing Enter in the prompt to submit
        document.getElementById('prompt').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('submitBtn').click();
            }
        });
    </script>
</body>
</html>
