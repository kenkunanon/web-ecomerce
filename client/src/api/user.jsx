import axios from "axios";
import API_URL from "./config";

export const createUserCart = async (token, cart) => {
  return axios.post(`${API_URL}/api/user/cart`, cart, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listUserCart = async (token) => {
  return axios.get(`${API_URL}/api/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveAddress = async (token, address) => {
  return axios.post(
    `${API_URL}/api/user/address`,
    { address },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const saveOrder = async (token, payload) => {
  return axios.post(`${API_URL}/api/user/order`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getOrders = async (token) => {
  return axios.get(`${API_URL}/api/user/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const placeOrder = async (token) => {
  return axios.post(
    `${API_URL}/api/user/place-order`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
