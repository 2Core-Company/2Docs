export interface Files{
  id: string
  id_user: string
  id_company: string
  id_enterprise: string
  id_event: string
  id_folder: string
  size: number
  name: string
  path: string
  viewedDate: number | null
  type: string
  from: 'admin' | 'user'
  message: string
  messageNotif?: boolean
  created_date: number
  checked?: boolean
  trash: boolean
  favorite: boolean
  downloaded: boolean
  nameCompany?: string
  type2?: string
  id_share?: string
  isPrivate?: boolean
  singleDownload?: boolean
}

export interface ShareFiles {
  id: string
  fileName: string
  type: string
  shareUserAvatar: string
  shareUserName: string
  uploadDate: number
  path: string
  size: number
  message: string
}