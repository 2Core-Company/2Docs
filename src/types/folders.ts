
export interface Folders{
  name:string, 
  color:string
  isPrivate:boolean
  singleDownload: boolean
  onlyMonthDownload: boolean
  timeFile: 0 | 1 | 2 | 3
  id:string
}

  export interface FolderCfg {
    status: boolean;
    name: string;
    color: string;
    isPrivate: boolean;
    singleDownload: boolean;
    onlyMonthDownload: boolean;
    timeFile: 0 | 1 | 2 | 3;
  }