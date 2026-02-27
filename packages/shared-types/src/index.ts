export type FolderNode = {
  id: string
  name: string
  children: FolderNode[]
}

export type FolderRecord = {
  id: string
  name: string
  parent_id: string | null
  created_at: Date
  updated_at: Date
}

export type FileRecord = {
  id: string
  name: string
  folder_id: string
  size: number
  created_at: Date
}
