import { google } from 'googleapis';

export async function createQuiz(auth, quizData) {
  const forms = google.forms({ version: 'v1', auth });

  const newForm = await forms.forms.create({
    requestBody: {
      info: {
        title: 'My Awesome Quiz',
      },
    },
  });

  const formId = newForm.data.formId;

  await forms.forms.batchUpdate({
    formId,
    requestBody: {
      requests: [
        {
          updateSettings: {
            settings: {
              quizSettings: {
                isQuiz: true,
              },
            },
            updateMask: 'quizSettings.isQuiz',
          },
        },
      ],
    },
  });

  for (const section of quizData) {
    for (const questionType in section) {
      for (const question of section[questionType]) {
        const request = {
          createItem: {
            item: {
              title: question.q,
              questionItem: {
                question: {
                  required: true,
                  grading: {
                    pointValue: 1,
                    correctAnswers: {
                      answers: [{ value: String(question.answer) }],
                    },
                  },
                },
              },
            },
            location: {
              index: 0,
            },
          },
        };

        if (questionType === 'mcq') {
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: 'RADIO',
            options: question.options.map(opt => ({ value: opt })),
          };
        } else if (questionType === 'fillBlanks') {
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: false,
          };
        } else if (questionType === 'trueFalse') {
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: 'RADIO',
            options: [{ value: 'true' }, { value: 'false' }],
          };
        }

        await forms.forms.batchUpdate({
          formId,
          requestBody: {
            requests: [request],
          },
        });
      }
    }
  }

  console.log(`Quiz created: ${newForm.data.responderUri}`);
}
