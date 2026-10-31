
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/departments';

export async function getDepartments() {
  const response = await axios.get(API_URL);
  return response.data;
}
