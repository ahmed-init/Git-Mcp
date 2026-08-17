import { askAssistant } from "../ai/assistant.js";

export async function chat(req, res) {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Question is required"
                }
            });
        }

        const answer = await askAssistant(question);

        return res.json({
            success: true,
            data: {
                question,
                answer
            }
        });

    } catch (error) {
        console.error("Chat error:", error);

        return res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });
    }
}