
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

        try {
            console.log('🤖 Testing gemini-1.5-flash-latest...');
            const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const resultFlash = await modelFlash.generateContent("Hello?");
            console.log('✅ gemini-1.5-flash-latest Response:', resultFlash.response.text());
            return;
        } catch (error: any) {
            console.error('❌ Error with gemini-1.5-flash-latest:', error.message);
        }

        try {
            console.log('🤖 Testing gemini-1.0-pro...');
            const modelPro = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const resultPro = await modelPro.generateContent("Hello?");
            console.log('✅ gemini-1.0-pro Response:', resultPro.response.text());
        } catch (error: any) {
            console.error('❌ Error with gemini-1.0-pro:', error.message);
        }
    } catch (error: any) {
        console.error('❌ Global Error:', error);
    }
}

testAI();
