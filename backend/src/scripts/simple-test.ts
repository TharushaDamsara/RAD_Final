
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('API KEY MISSING');
    process.exit(1);
}

async function run() {
    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Test");
        console.log("SUCCESS");
        console.log(result.response.text());
    } catch (e: any) {
        console.error("FAILED");
        console.error(e.message);
    }
}

run();
