
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('API KEY MISSING');
    process.exit(1);
}

const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-002',
    'gemini-pro',
    'gemini-2.0-flash-exp'
];

async function run() {
    const genAI = new GoogleGenerativeAI(apiKey as string);

    console.log("Checking models...");
    for (const m of models) {
        console.log(`Trying ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Hi");
            console.log(`✅ SUCCESS: ${m}`);
            // Force exit after first success to save time
            process.exit(0);
        } catch (e: any) {
            // console.log(`❌ ${m} Failed: ${e.message.split('\n')[0]}`);
        }
    }
    console.log("❌ NO MODELS WORKING");
    process.exit(1);
}

run();
