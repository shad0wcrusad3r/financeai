const express = require('express');
const router = express.Router();
// Import Bytez.js. If it exports a default class we can use 'new Bytez'
const Bytez = require('bytez.js');
const { protect } = require('../middlewares/authMiddleware');

router.post('/budget-plan', protect, async (req, res) => {
    try {
        const { financial_goals, current_situation } = req.body;
        
        if (!process.env.BYTEZ_API_KEY) {
            return res.status(500).json({ error: "Bytez API key is not configured on the server." });
        }

        const sdk = new Bytez(process.env.BYTEZ_API_KEY);
        const bytez_model = sdk.model("deepseek-ai/DeepSeek-R1");

        const system_prompt = `You are a senior financial planner. Given a user's financial goals, current financial situation, and a list of research results,
your goal is to generate a personalized financial plan that meets the user's needs and preferences.

Instructions:
Given a user's financial goals, current financial situation, and a list of research results, generate a personalized financial plan that includes suggested budgets, investment plans, and savings strategies.
Ensure the plan is well-structured, informative, and engaging.
Ensure you provide a nuanced and balanced plan, quoting facts where possible.
Remember: the quality of the plan is important.
Focus on clarity, coherence, and overall quality.
Never make up facts or plagiarize. Always provide proper attribution.`;

        const user_message = `Financial goals: ${financial_goals}, Current situation: ${current_situation}`;

        const messages = [
            { "role": "system", "content": system_prompt },
            { "role": "user", "content": user_message }
        ];

        const results = await bytez_model.run(messages);

        if (results.error) {
            return res.status(500).json({ error: results.error });
        }

        // Defensively extract the string output
        let textOutput = "";
        if (typeof results.output === 'string') {
            textOutput = results.output;
        } else if (results.output && results.output.content) {
            textOutput = results.output.content; // Deepseek / Chat completions style
        } else if (Array.isArray(results.output) && results.output.length > 0) {
            textOutput = results.output[0].content || results.output[0].text || JSON.stringify(results.output);
        } else {
            textOutput = JSON.stringify(results.output);
        }

        res.json({ output: textOutput });

    } catch (error) {
        console.error("AI Budget Planner Error:", error);
        res.status(500).json({ error: "Failed to generate financial plan. " + error.message });
    }
});

module.exports = router;
