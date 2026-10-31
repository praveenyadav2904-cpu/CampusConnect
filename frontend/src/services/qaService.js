
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export async function searchQA(search) {
  const response = await axios.get(`${API_BASE_URL}/campus-search`, {
    params: { search },
  });

  return response.data;
}
