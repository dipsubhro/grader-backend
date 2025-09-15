import express from 'express';
import { main as runQuizGenerator } from './quiz.js';

const app = express();
const port = 3000;

app.get('/generate-quiz', async (req, res) => {
  try {
    console.log('Received request to generate quiz.');
    const quizLink = await runQuizGenerator();
    res.status(200).send(`${quizLink}`);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).send('Error generating quiz.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
