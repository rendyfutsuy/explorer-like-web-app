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

export type ItemRecord = {
  id: string
  name: string
  parent_id: string | null
  size: number | null
  file_path: string | null
  is_file: boolean
  created_at: Date
}
