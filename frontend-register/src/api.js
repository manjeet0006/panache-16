import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api', // Change to your deployed URL later
});


export default API;