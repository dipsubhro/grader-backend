import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuiz(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a quiz generator.
  Based on the following text, create a JSON quiz with:
  - 3 multiple choice questions
  - 2 fill-in-the-blanks
  - 2 true/false

  Format:
  {
    "mcq": [{ "q": "...", "options": ["a","b","c","d"], "answer": "..." }],
    "fillBlanks": [{ "q": "...", "answer": "..." }],
    "trueFalse": [{ "q": "...", "answer": true }]
  }

  Text:
  ${text}
  `;

  const result = await model.generateContentStream(prompt);
  let quizText = '';
  for await (const chunk of result.stream) {
    quizText += chunk.text();
  }
  return quizText;
}

export async function generateQuizWithRetry(chunk, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateQuiz(chunk);
    } catch (err) {
      if (err.status === 429 || err.status === 503) {
        const waitTime = 60000; // 60s
        console.log(
          `⚠️ Rate limit hit. Waiting ${waitTime / 1000}s before retry...`
        );
        await new Promise((res) => setTimeout(res, waitTime));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed after multiple retries");
}
