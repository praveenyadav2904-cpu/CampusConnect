
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/complaints';

export async function submitComplaint(complaint) {
  const response = await axios.post(API_URL, complaint);
  return response.data;
}


export async function getComplaints() {
  const response = await axios.get(API_URL);
  return response.data;
}
