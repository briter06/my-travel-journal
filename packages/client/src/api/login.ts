import axios from 'axios';
import { environment } from '../env/environment';

export const login = async (username: string) => {
  try {
    const result = await axios.post(`${environment.apiUrl}/auth/login`, {
      username,
    });
    localStorage.setItem('token', result.data.token);
    return true;
  } catch (err) {
    return false;
  }
};
