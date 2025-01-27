export interface FileType {
    id: number
    uid: string
    user: number
    folder: any
    updated_at: string
    created_at: string
    file: string
    filename: string
    filesize: string
    user_name: string
}

export interface FolderType {
    id: number
    uid: string
    name: string
    created_at: string
    updated_at: string
    files_total: number
    parent_uid: string
    parent_name: string
    folders_total: number
    user_name: string
}