"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Folder, File, MoreVertical, Plus, Trash2, Info, Loader2, Edit, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { urlEncode } from "@/commons/utils/http.util"
import { API_URL } from "@/commons/constants/api.constant"
import {
  createFolder,
  deleteFile,
  deleteFolder,
  getFiles,
  getFolder,
  getFolders,
  updateFolder,
  uploadFiles,
} from "@/commons/services/files.service"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useSearchParams } from "react-router-dom"
import type { FileType, FolderType } from "@/commons/models/files.model"
import { format as formatDate, milliseconds } from "date-fns"
import { downloadFile } from "@/commons/utils/helpers.util"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

type Item = {
  id: string
  name: string
  type: any
  size?: string
  modified: string
  created: string
  createdBy: string
  items?: Item[]
}

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const folderUUID = searchParams.get("folder")

  const { data: foldersData, refetch: refetchFolders } = useQuery({
    queryKey: ["folders", folderUUID],
    refetchOnWindowFocus: false,
    queryFn: () => getFolders({ folder: folderUUID }).then((res) => res.data),
  })

  const { data: fileData, refetch: refetchFiles } = useQuery({
    queryKey: ["files", folderUUID],
    refetchOnWindowFocus: false,
    queryFn: () => getFiles({ folder: folderUUID }).then((res) => res.data),
  })
  const { data: folderData, refetch: refetchFolder } = useQuery({
    queryKey: ["folder-detail"],
    refetchOnWindowFocus: false,
    queryFn: () => getFolder(folderUUID).then((res) => res.data),
    enabled: !!folderUUID,
  })

  const [newFolderName, setNewFolderName] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FolderType | FileType | null>(null)
  const [itemToView, setItemToView] = useState<Item | null>(null)
  const [folderToEdit, setFolderToEdit] = useState<FolderType | null>(null)
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false)
  const [editedFolderName, setEditedFolderName] = useState("")
  const [showFolders, setShowFolders] = useState(true)
  const [showFiles, setShowFiles] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: (data) => {
      setNewFolderName("")
      setIsCreateFolderOpen(false)
      toast({
        title: "Folder created",
        description: `Folder "${data.data.name}" has been created successfully.`,
      })
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
    onError: (error) => {
      console.error("Failed to create folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
    },
  })
  const updateFolderMutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: (data) => {
      queryClient.setQueryData(["folders", folderUUID], (oldData: FolderType[]) => {
        return oldData.map((folder) => (folder.id === data.data.id ? { ...folder, ...data.data } : folder))
      })
      toast({
        title: "Folder updated",
        description: `Folder "${data.data.name}" has been updated successfully.`,
      })

      setIsEditFolderOpen(false)
    },
    onError: (error) => {
      console.error("Failed to update folder:", error)
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive",
      })
    },
  })
  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (data) => {
      queryClient.setQueryData(["folders", folderUUID], (res: FolderType[]) => {
        const results = (res || []).filter((file) => file.id !== itemToDelete?.id)
        return results
      })
      toast({
        title: "Deleted",
        description: "Folder successfully deleted",
      })
      setItemToDelete(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the folder. Please try again.",
        variant: "destructive",
      })
    },
  })
  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: (data) => {
      queryClient.setQueryData(["files", folderUUID], (res: FileType[]) => {
        const results = (res || []).filter((file) => file.id !== itemToDelete?.id)
        return results
      })
      toast({
        title: "Deleted",
        description: "File successfully deleted",
      })
      setItemToDelete(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate({
        name: newFolderName.trim(),
        parent: folderData?.id,
      })
    } else {
      toast({
        title: "Error",
        description: "Folder name is required.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFolder = (item: FolderType) => {
    setItemToDelete(item)
  }

  const handleDeleteFile = (item: FileType) => {
    setItemToDelete(item)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    if ("files_total" in itemToDelete) {
      deleteFolderMutation.mutate(itemToDelete.uid)
    } else {
      deleteFileMutation.mutate(itemToDelete.uid)
    }
  }

  const handleViewFolder = (item: FolderType) => {
    setItemToView({
      created: formatDate(item.created_at, "MMM dd yyyy HH:mm"),
      createdBy: item.user_name,
      id: item.uid,
      modified: formatDate(item.updated_at, "MMM dd yyyy HH:mm"),
      name: item.name,
      type: "f",
    })
  }
  const handleViewFile = (item: FileType) => {
    setItemToView({
      created: formatDate(item.created_at, "MMM dd yyyy HH:mm"),
      createdBy: item.user_name,
      id: item.uid,
      modified: formatDate(item.updated_at, "MMM dd yyyy HH:mm"),
      size: item.filesize,
      name: item.filename,
      type: "a",
    })
  }

  const calculateFolderSize = (folder: Item): string => {
    let totalSize = 0
    const sizes =
      folder.items?.map((item) => {
        if (item.type === "file") {
          return Number.parseInt(item.size?.replace(" MB", "") || "0")
        } else if (item.type === "folder") {
          return Number.parseInt(calculateFolderSize(item).replace(" MB", ""))
        }
        return 0
      }) || []
    totalSize = sizes.reduce((a, b) => a + b, 0)
    return `${totalSize} MB`
  }

  const handleUpdateFolder = () => {
    if (folderToEdit && editedFolderName.trim() !== folderToEdit.name) {
      updateFolderMutation.mutate({ uid: folderToEdit.uid, data: { name: editedFolderName.trim() } })
    }
  }

  const openEditModal = (folder: FolderType) => {
    setFolderToEdit(folder)
    setEditedFolderName(folder.name)
    setIsEditFolderOpen(true)
  }

  function refetchByFolder(folder: string) {
    if (!folder) {
      searchParams.delete("folder")
      setSearchParams(searchParams)
      queryClient.setQueryData(["folder-detail"], null)
    } else {
      setSearchParams({ folder })
    }
    setTimeout(() => {
      refetchFolders()
      refetchFiles()
      refetchFolder()
    }, 10)
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const sortItems = (items: any[]) => {
    return items.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || a.filename).localeCompare((b.name || b.filename))
      } else if (sortBy === "created_at") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold truncate pr-4">{folderData?.name ? folderData?.name + "/" : "/"}</h2>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upload File</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <FilePond
                allowMultiple={true}
                maxFiles={3}
                chunkUploads={true}
                chunkSize={50000}
                server={{
                  url: urlEncode([API_URL, "fp"]),
                  process: "process/",
                  patch: "patch/",
                  revert: "revert/",
                  fetch: "fetch/?target=",
                  load: "load/?target=",
                }}
                onprocessfile={(error, file) => {
                  if (error) {
                    console.error("Failed to upload file:", error)
                    toast({
                      title: "Error",
                      description: "Failed to upload file. Please try again.",
                      variant: "destructive",
                    })
                  } else {
                    uploadFiles({
                      folder: folderData?.id,
                      upload_id: file.serverId,
                    }).then((res) => {
                      queryClient.invalidateQueries({
                        queryKey: ["files"],
                      })
                      toast({
                        title: "File uploaded",
                        description: `File "${file.filename}" has been uploaded successfully.`,
                      })
                    })
                  }
                }}
                name="filepond"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={handleCreateFolder} disabled={createFolderMutation.isPending || !newFolderName.trim()}>
                  {createFolderMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search files and folders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Created At</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folderData && (
            <TableRow
              onClick={() => {
                if (folderData?.parent_uid) {
                  refetchByFolder(folderData.parent_uid)
                } else {
                  refetchByFolder("")
                }
              }}
            >
              <TableCell colSpan={4}>
                <div className="flex items-center truncate">
                  <Folder className="inline mr-2" />
                  <p className="truncate font-bold max-w-[192px]">../</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {showFolders &&
            sortItems(foldersData || [])
              .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item) => (
                <TableRow className="cursor-pointer" key={item.id}>
                  <TableCell
                    onClick={() => {
                      setSearchParams({ folder: item.uid })
                      setTimeout(() => {
                        refetchByFolder(item.uid)
                      })
                    }}
                    className="font-medium"
                  >
                    <div className="flex items-center truncate">
                      <Folder className="inline mr-2" />
                      <p className="truncate max-w-[192px]">{item.name}</p>
                      {item.files_total + item.folders_total > 0 && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{formatDate(item.updated_at, "MMM dd, yyyy h:mm a")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleViewFolder(item)}>
                          <Info className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openEditModal(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteFolder(item)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

          {showFiles &&
            sortItems(fileData || [])
              .filter((item) => item.filename.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell onClick={() => downloadFile(item.file, item.filename)} className="font-medium">
                    <div className="flex items-center">
                      <File className="inline mr-2" />
                      <p className="truncate max-w-[192px]">{item.filename}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.filesize || "-"}</TableCell>
                  <TableCell>{formatDate(item.updated_at, "MMM dd, yyyy h:mm a")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleViewFile(item)}>
                          <Info className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => downloadFile(item.file, item.filename)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteFile(item)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

          {(!showFiles || fileData?.length === 0) && (!showFolders || foldersData?.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <div className="my-4">No files or folders found.</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {itemToDelete && "filename" in itemToDelete
              ? `Are you sure you want to delete the file "${itemToDelete.filename}"?`
              : itemToDelete
                ? `Are you sure you want to delete the folder "${itemToDelete.name}" and all its contents?`
                : "Are you sure you want to delete this item?"}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleteFolderMutation.isPending || deleteFileMutation.isPending}
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteFolderMutation.isPending || deleteFileMutation.isPending}
              onClick={confirmDelete}
            >
              {deleteFileMutation.isPending || deleteFolderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!itemToView} onOpenChange={() => setItemToView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="break-all pr-5">{itemToView?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Size</Label>
              <div className="col-span-3">
                {itemToView?.type === "folder" ? calculateFolderSize(itemToView) : itemToView?.size || "-"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Created</Label>
              <div className="col-span-3">{itemToView?.created}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Modified</Label>
              <div className="col-span-3">{itemToView?.modified}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Created By</Label>
              <div className="col-span-3">{itemToView?.createdBy}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setItemToView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder Name</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={editedFolderName}
            onChange={(e) => setEditedFolderName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFolderOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateFolder}
              disabled={
                updateFolderMutation.isPending ||
                !editedFolderName.trim() ||
                editedFolderName.trim() === folderToEdit?.name
              }
            >
              {updateFolderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

