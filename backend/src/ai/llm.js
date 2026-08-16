import OpenAI from "openai";
import config from "../config/config.js";

const openai = new OpenAI({
    apiKey: config.openrouterapikey,
    baseURL: "https://openrouter.ai/api/v1"
});

export async function askLLM(messages, tools = []) {

    const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages,
        tools,
        tool_choice: "auto"
    });

    return response.choices[0].message;

}
