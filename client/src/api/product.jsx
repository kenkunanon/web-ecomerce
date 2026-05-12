import axios from "axios";
import API_URL from "./config";

export const createProduct = async (token, form) => {
  return axios.post(`${API_URL}/api/product`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listProduct = async (count = 20) => {
  return axios.get(`${API_URL}/api/products/${count}`);
};

export const readProduct = async (token, id) => {
  return axios.get(`${API_URL}/api/product/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteProduct = async (token, id) => {
  return axios.delete(`${API_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProduct = async (token, id, form) => {
  return axios.put(`${API_URL}/api/products/${id}`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadFiles = async (token, form) => {
  return axios.post(
    `${API_URL}/api/images`,
    { image: form },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFiles = async (token, public_id) => {
  return axios.post(
    `${API_URL}/api/removeimages`,
    { public_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const searchFilters = async (arg) => {
  return axios.post(`${API_URL}/api/search/filters`, arg);
};

export const listProductBy = async (sort, order, limit) => {
  return axios.post(`${API_URL}/api/productby`, { sort, order, limit });
};
