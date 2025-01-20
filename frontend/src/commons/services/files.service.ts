import axios from "axios";
import { urlEncode } from "../utils/http.util";
import { API_URL } from "../constants/api.constant";

export function createFolder(data: any) {
    return axios.post(urlEncode([API_URL, 'files', 'folders']), data)
}

export function uploadFiles(data: any) {
    return axios.post(urlEncode([API_URL, 'files']), data)
}
