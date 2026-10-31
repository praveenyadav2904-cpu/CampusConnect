
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/faculty';

export async function getFaculty() {
  const response = await axios.get(API_URL);
  return response.data;
}
