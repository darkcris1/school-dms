import axios from "axios";
import { urlEncode } from "../utils/http.util";
import { API_URL } from "../constants/api.constant";
import { FileType, FolderType } from "../models/files.model";

export function createFolder(data: any) {
    return axios.post(urlEncode([API_URL, 'files', 'folders']), data)
}

export function uploadFiles(data: any) {
    return axios.post(urlEncode([API_URL, 'files']), data)
}

export function getFolder(uuid: any) {
    return axios.get<FolderType>(urlEncode([API_URL, 'files', 'folders', uuid]))
}

export function updateFolder({ uid, data}: { uid: any, data: any }) {
    return axios.put<FolderType>(urlEncode([API_URL, 'files', 'folders', uid]), data)
}
export function deleteFolder(uuid: any) {
    return axios.delete<FolderType>(urlEncode([API_URL, 'files', 'folders', uuid]))
}

export function deleteFile(uid: any) {
    return axios.delete<FileType>(urlEncode([API_URL, 'files', uid]))
}


export function getFiles(qs = {}) {
    return axios.get<FileType[]>(urlEncode([API_URL, 'files'], qs))
}

export function getFolders(qs = {}) {
    return axios.get<FolderType[]>(urlEncode([API_URL, 'files', 'folders'], qs))
}
