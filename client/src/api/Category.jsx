import axios from 'axios';
import API_URL from './config';

export const createCategory = async (token, form) => {
    return axios.post(`${API_URL}/api/category`, form, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export const listCategory = async () => {
    return axios.get(`${API_URL}/api/category`)
}

export const removeCategory = async (token, id) => {
    return axios.delete(`${API_URL}/api/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}
