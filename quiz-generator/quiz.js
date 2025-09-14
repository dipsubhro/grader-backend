import fs from 'fs/promises';
import { generateQuizWithRetry } from './src/quizGenerator.js';
import { authenticate } from './src/googleAuth.js';
import { createQuiz } from './src/formCreator.js';

async function main() {
  try {
    // Generate the quiz
    console.log('⚡ Generating quiz...');
    const extractedText = await fs.readFile("../pdf-extractor/output.txt", "utf-8");
    const chunks = extractedText.split(/--- Page \d+/).filter(chunk => chunk.trim() !== '');
    const allQuizzes = [];

    for (let i = 0; i < chunks.length; i++) {
      const quiz = await generateQuizWithRetry(chunks[i]);
      let quizData = quiz;
      const match = quizData.match(/```json\n([\s\S]*)\n```/);
      if (match) {
        quizData = match[1];
      }
      allQuizzes.push(JSON.parse(quizData));
    }
    await fs.writeFile("quiz.json", JSON.stringify(allQuizzes, null, 2));
    console.log('✅ Quiz saved to quiz.json');

    // Create the Google Form
    console.log('🚀 Creating Google Form...');
    const auth = await authenticate();
    await createQuiz(auth, allQuizzes);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
