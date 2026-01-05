
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
    console.error('❌ API Key missing');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('🔍 Querying:', url.replace(apiKey, 'HIDDEN_KEY'));

async function listModels() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text);
            fs.writeFileSync(path.join(__dirname, 'model_list.txt'), `Error: ${response.status} ${text}`);
            return;
        }

        const data = await response.json();
        const models = (data as any).models || [];

        let output = 'Available Models:\n';
        models.forEach((m: any) => {
            if (m.supportedGenerationMethods?.includes('generateContent')) {
                output += `- ${m.name.replace('models/', '')}\n`;
            }
        });

        fs.writeFileSync(path.join(__dirname, 'model_list.txt'), output);
        console.log('✅ Models written to model_list.txt');

    } catch (error: any) {
        fs.writeFileSync(path.join(__dirname, 'model_list.txt'), `Error: ${error.message}`);
    }
}

listModels();
