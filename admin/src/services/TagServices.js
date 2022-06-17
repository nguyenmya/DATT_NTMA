import axios from 'axios'
import { API_URL } from '../constants'
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` }

export const getAllTag = (search) => {
    return axios({
        method: 'GET',
        url: `${API_URL}/api/tag/all?page=${search.page}&limit=${search.limit}`,
        headers: headers
    })
}

export const getOneItem = (id) => {
    return axios.get(`${API_URL}/api/tag/${id}`);
}

export const deleteItem = (id) => {
    return axios({
        method: 'DELETE',
        url: `${API_URL}/api/tag/${id}`,
        headers: headers
    });
}

export const checkCode = (id, code) => {
    const config = { params: { id: id, code: code } };
    return axios.get(`${API_URL}/api/tag/checkCode`, config);
}

export const saveItem = (tag) => {
    return axios({
        method: 'POST',
        url: `${API_URL}/api/tag`,
        data: tag,
        headers: headers
    })
}

export const updateItem = (tag) => {
    return axios({
        method: 'PUT',
        url: `${API_URL}/api/tag/${tag.id}`,
        data: tag,
        headers: headers
    })
}
