import axios from "axios";
import { urlEncode } from "../utils/http.util";
import { API_URL } from "../constants/api.constant";
import { atom } from "nanostores";
import { User } from "../models/users.model";

export const currentUser = atom<User | null>(null)

export function login(data: any){
    return axios.post(urlEncode([API_URL, 'login']), data).then((res)=>{
        res.data.token
        return res
    })
}

export function getUser(data: any){
    return axios.post(urlEncode([API_URL, 'login']), data).then(res => {
        currentUser.set(res.data)
        return res
    })
}

export function isLoggedIn(){
    return currentUser.get() !== null
}