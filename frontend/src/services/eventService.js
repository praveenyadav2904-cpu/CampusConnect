
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

export async function getEvents() {
  const response = await axios.get(API_URL);
  return response.data;
}
