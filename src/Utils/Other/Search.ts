interface PropsSearch{
  text:string
  data:any
  setReturn:Function
}


export function Search({text, data, setReturn}:PropsSearch){
  if (text != null) {
    const searchUserFilter: Array<object> = [];
    for (var i = 0; i < data.length; i++) {
      if (
        data[i].name.toLowerCase().includes(text.toLowerCase().trim())
      ) {
        searchUserFilter.push(data[i]);
      }
    }
    setReturn(searchUserFilter);
  }
}