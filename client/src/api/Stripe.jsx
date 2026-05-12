import axios from 'axios';
import API_URL from './config';

export const payment = async (token) => await axios.post(
    `${API_URL}/api/user/create-payment-intent`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
)
