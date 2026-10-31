
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/campus-locations';

export async function getCampusLocations({ search = '', type = '' } = {}) {
  const response = await axios.get(API_URL, {
    params: {
      ...(search.trim() && { search: search.trim() }),
      ...(type.trim() && { type: type.trim() }),
    },
  });

  return response.data;
}

export async function getCampusLocationById(locationId) {
  const response = await axios.get(
    `${API_URL}/${encodeURIComponent(locationId)}`
  );

  return response.data;
}
