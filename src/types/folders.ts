
export interface Folders{
  name:string, 
  color:string
  isPrivate:boolean
  singleDownload: boolean
  onlyMonthDownload: boolean
  timeFile: number
  id:string
}

  export interface FolderCfg {
    status: boolean;
    name: string;
    color: string;
    isPrivate: boolean;
    singleDownload: boolean;
    onlyMonthDownload: boolean;
    timeFile: number;
  }