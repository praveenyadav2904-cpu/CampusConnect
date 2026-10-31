
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/library';

export async function getLibraryBooks() {
  const response = await axios.get(API_URL);
  return response.data;
}
