

export function FormatDate(date:string){
  if(date?.length > 12){
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augusto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    var newDate = new Date(date)
    var month = newDate.getMonth()
    return date.substr(8, 2) + " de " + months[month] + " de " + date.substr(11, 4)
  } 
}

export function FormatDateSmall(date:string){
  var newDate = new Date(date)
  return newDate.toLocaleDateString()
}
