import axios from 'axios';

const API = axios.create({
  baseURL: 'https://panache-16.onrender.com/api', // Change to your deployed URL later
});


export default API;