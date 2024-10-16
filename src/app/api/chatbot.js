import OpenAI from "openai";

// Initialize OpenAI with the API key
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { message } = req.body;

		try {
			// OpenAI's API call for chat completions (GPT-3.5 or GPT-4)
			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "You are an expert in personal finance." },
					{
						role: "user",
						content: `Please provide an answer related to finance: ${message}`,
					},
				],
				max_tokens: 80,
				temperature: 0.7,
			});

			// Send the AI's response back to the frontend
			res.status(200).json({ reply: response.choices[0].message.content });
		} catch (error) {
			console.error("Error with OpenAI API:", error);
			res.status(500).json({ error: "Failed to generate response" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
