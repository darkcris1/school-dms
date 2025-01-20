import { Button } from "@/components/ui/button"
import { Folder, File, Upload, FolderPlus } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 bg-background border-r p-4">
      <Button className="w-full mb-2">
        <Upload className="mr-2 h-4 w-4" /> Upload File
      </Button>
      <Button className="w-full">
        <FolderPlus className="mr-2 h-4 w-4" /> New Folder
      </Button>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Folder className="mr-2 h-4 w-4" /> My Files
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <File className="mr-2 h-4 w-4" /> Recent
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

