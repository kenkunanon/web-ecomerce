import axios from "axios";

const BASE = "http://localhost:5000/api";

const headers = (token) => ({ Authorization: `Bearer ${token}` });

export const listUsers = (token) =>
  axios.get(`${BASE}/users`, { headers: headers(token) });

export const changeRole = (token, id, role) =>
  axios.post(`${BASE}/change-role`, { id, role }, { headers: headers(token) });

export const changeStatus = (token, id, enabled) =>
  axios.post(`${BASE}/change-status`, { id, enabled }, { headers: headers(token) });

export const getOrderAdmin = (token) =>
  axios.get(`${BASE}/admin/orders`, { headers: headers(token) });

export const changeOrderStatus = (token, orderId, orderStatus) =>
  axios.put(`${BASE}/admin/order-status`, { orderId, orderStatus }, { headers: headers(token) });
