"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Folder, File, MoreVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { urlEncode } from "@/commons/utils/http.util"
import { API_URL } from "@/commons/constants/api.constant"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

type Item = {
  id: string
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
  items?: Item[]
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Documents", type: "folder", modified: "2023-04-20", items: [
      { id: "5", name: "document1.docx", type: "file", size: "1.2 MB", modified: "2023-04-21" }
    ]},
    { id: "2", name: "Images", type: "folder", modified: "2023-04-19", items: [] },
    { id: "3", name: "report.pdf", type: "file", size: "2.5 MB", modified: "2023-04-18" },
    { id: "4", name: "presentation.pptx", type: "file", size: "5.1 MB", modified: "2023-04-17" },
  ])

  const [newFolderName, setNewFolderName] = useState("")

  const handleCreateFolder = () => {
    if (newFolderName) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newFolderName,
          type: "folder",
          modified: new Date().toISOString().split("T")[0],
          items: [],
        },
      ])
      setNewFolderName("")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
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
                  url: urlEncode([API_URL, 'fp']),
                  process: 'process/',
                  patch: 'patch/',
                  revert: 'revert/',
                  fetch: 'fetch/?target=',
                  load: 'load/?target=',
                }}
                name="filepond"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
            </DialogContent>
          </Dialog>
          <div className="flex space-x-2">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.type === "folder" ? (
                  <div className="flex items-center">
                    <Folder className="inline mr-2" />
                    {item.name}
                    {item.items && item.items.length > 0 && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <File className="inline mr-2" />
                    {item.name}
                  </div>
                )}
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.size || "-"}</TableCell>
              <TableCell>{item.modified}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

