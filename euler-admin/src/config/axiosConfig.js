import axios from 'axios';

axios.defaults.baseURL = process.env.GATSBY_EULER_API_BASE_URL ? process.env.GATSBY_EULER_API_BASE_URL : '';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json'