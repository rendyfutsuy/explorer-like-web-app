export type FolderNode = {
  id: string
  name: string
  children: FolderNode[]
}

export type FolderRecord = {
  id: string
  name: string
  parent_id: string | null
  created_at: string | Date
  updated_at: string | Date
}

export type FileRecord = {
  id: string
  name: string
  folder_id: string
  size: number | bigint
  created_at: string | Date
}
