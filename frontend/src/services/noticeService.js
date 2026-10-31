
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notices';

// Demo headers only. Replace with verified JWT authentication later.
function getDemoHeaders() {
  return {
    'x-demo-role': sessionStorage.getItem('demoRole') || '',
    'x-demo-user': sessionStorage.getItem('demoUserId') || '',
  };
}

// Get published notices.
// Admin can also request notices pending approval.
export async function getNotices({ includePending = false } = {}) {
  const response = await axios.get(API_URL, {
    params: includePending ? { includePending: 'true' } : {},
    headers: getDemoHeaders(),
  });

  return response.data;
}

// Create a notice in MongoDB through the backend API.
export async function createNotice(noticeData) {
  const response = await axios.post(API_URL, noticeData, {
    headers: getDemoHeaders(),
  });

  return response.data;
}

// Approve an official notice.
export async function approveNotice(noticeId) {
  const response = await axios.patch(
    `${API_URL}/${noticeId}/approve`,
    {},
    {
      headers: getDemoHeaders(),
    }
  );

  return response.data;
}
