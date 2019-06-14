import axios from 'axios'; // Cliente HTTP

const api = axios.create({
    baseURL : 'https://cartorio-if-backend.herokuapp.com'//'http://localhost:3333'
});

export default api;