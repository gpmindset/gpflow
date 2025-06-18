import axios from "axios"

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function postCall<T>(url: string, data: any) {
    return axios.post<T>(`${BASE_URL}${url}`, data)
}