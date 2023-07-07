import axios from "axios"

export const api = axios.create({
    baseURL: '/api' // em vez de ser http://localhost:3000/api porque esta na mesma url do frontend
})

