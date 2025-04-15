import axios from 'axios';
/**
 * Calls OpenAI's API to get a comparison score between two images
 * @param {File} modelImageFile - the reference 3D model image
 * @param {File} drawingImageFile - the user drawing image
 * @returns {Promise<string>} - the score (1-100) or error message
 */
export const generateComparisonScore = async ({modelImageFile, drawingImageFile}) => {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'This is an app for users to practice 3D spatial awareness. I will give you two images to compare: one is a user drawing, the other is a snapshot of the 3D model. Give me a score from 1–100 based on the similarity of the images. Only type the number.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: modelImageFile,
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: drawingImageFile,
                }
              }
            ]
          }
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return 'Error: Unable to generate response.';
  }
};
