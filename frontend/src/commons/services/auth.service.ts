import axios from "axios";
import { urlEncode } from "../utils/http.util";
import { API_URL } from "../constants/api.constant";
import { atom } from "nanostores";
import { User } from "../models/users.model";

export const currentUser = atom<User | null>(null)

export function login(data: any) {
    return axios.post<{ key: string }>(urlEncode([API_URL, 'auth', 'login']), data).then((res) => {
        return res
    })
}

export function getUser(data: any) {
    return axios.post(urlEncode([API_URL, 'login']), data).then(res => {
        currentUser.set(res.data)
        return res
    })
}

const TOKEN_KEY = 'an128ab290'
export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY)
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function logout() {
    removeToken()
    location.href = '/login'
    currentUser.set(null)
}