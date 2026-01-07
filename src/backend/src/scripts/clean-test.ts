
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

async function run() {
    if (!apiKey) {
        console.log('API KEY MISSING');
        process.exit(1);
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = [
        "gemini-1.5-flash",
        "gemini-2.0-flash-lite-preview",
        "gemini-2.0-flash",
        "gemini-pro"
    ];

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`SUCCESS [${m}]: ${result.response.text().substring(0, 20)}...`);
        } catch (e: any) {
            console.log(`ERROR [${m}] Status:${e.status} Msg:${e.message.substring(0, 50)}`);
        }
    }
}

run();
