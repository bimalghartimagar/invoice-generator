import axios from 'axios'
export default axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    // headers: { 'X-Custom-Header': 'foobar' }
});