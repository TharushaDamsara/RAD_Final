
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the backend folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is missing in .env');
    process.exit(1);
}

console.log('🔑 Found API Key:', apiKey.substring(0, 8) + '...');

async function testAI() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey as string);

        // 1. List Models (if supported, otherwise we skip)
        // Note: The SDK might not expose listModels directly easily, 
        // but we can try a direct generation test.

        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-pro-latest",
            "gemini-1.0-pro"
        ];

        for (const modelName of modelsToTest) {
            try {
                console.log(`🤖 Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello?");
                console.log(`✅ ${modelName} Response:`, result.response.text());
                console.log(`💡 SUGGESTION: Use ${modelName} as the default model.`);
                continue;
            } catch (error: any) {
                console.error(`❌ Error with ${modelName}:`, error.message);
            }
        }
    } catch (error: any) {
        console.error('❌ Global Error:', error);
    }
}

testAI();
