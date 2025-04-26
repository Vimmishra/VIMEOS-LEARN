require('dotenv').config(); // Ensure environment variables are loaded
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Use the environment variable ---
// Fetch the Gemini API key from the environment
const apiKey = process.env.GEMINI_API_KEY;


if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");

}


const genAI = new GoogleGenerativeAI(apiKey);


exports.generateQuiz = async (req, res) => {

    if (!apiKey) {
        console.error("Gemini API key is not configured.");
        return res.status(500).json({ error: "Server configuration error: API Key missing." });
    }

    try {

        const { topic, numQuestions } = req.body;

        console.log("Generating quiz for topic:", topic);
        console.log("Number of questions:", numQuestions);


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });


        const prompt =
            `Generate ${numQuestions} multiple-choice questions on ${topic}.
Each question should have 4 options (A-D) and one correct answer.
Format:

Question: ...
Options:
A. ...
B. ...
C. ...
D. ...
Answer: ...
;`;


        const result = await model.generateContent(prompt);
        const text = result.response.text(); // AI response text containing questions

        console.log("Raw AI Response:\n", text);

        // Parse the AI-generated text into structured quiz questions
        const questions = text
            .split("Question:")
            .filter((q) => q.trim())
            .map((q) => {
                // Split question from options part
                const [questionPart, ...rest] = q.trim().split("Options:");
                const question = questionPart.trim();

                // Extract options and answer from the remaining text
                const optionsStr = rest.join("Options:").trim();
                const answerMatch = optionsStr.match(/Answer:\s*(.*)/);
                const optionsPart = answerMatch ? optionsStr.substring(0, answerMatch.index).trim() : optionsStr;


                const options = optionsPart
                    .split('\n')
                    .map(opt => opt.replace(/^[A-D]\.\s*/, '').trim()) // Remove option labels (A., B., etc.)
                    .filter(Boolean); // Remove any empty or malformed options

                const correctAnswer = answerMatch ? answerMatch[1].trim() : "";


                if (!question || options.length !== 4 || !correctAnswer) {
                    console.warn("Skipping malformed question structure:\n", q);
                    return null; // Skip malformed entries
                }

                // Return the structured question data
                return {
                    question,
                    options,
                    correctAnswer,
                };
            }).filter(Boolean);


        res.json({ quiz: questions });
    } catch (error) {

        console.error("Gemini API Error:", error);


        if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid API key"))) {
            res.status(401).json({ error: "Authentication failed. Check server API Key configuration." });
        } else {
            res.status(500).json({ error: "Failed to generate quiz due to an internal error." });
        }
    }
};
