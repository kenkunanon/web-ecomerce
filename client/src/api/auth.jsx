import axios from 'axios';
import API_URL from './config';

export const register = async (form) => await axios.post(`${API_URL}/api/register`, form)

export const currentUser = async (token) => await axios.post(`${API_URL}/api/current-user`, {}, {
    headers: { Authorization: `Bearer ${token}` }
})

export const currentAdmin = async (token) => {
    return await axios.post(`${API_URL}/api/current-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
}
