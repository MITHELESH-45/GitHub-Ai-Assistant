import axios from 'axios';

async function test() {
  try {
    const response = await axios.post('http://localhost:5000/api/repo/analyze', {
      url: 'https://github.com/octocat/Spoon-Knife'
    });
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

test();
