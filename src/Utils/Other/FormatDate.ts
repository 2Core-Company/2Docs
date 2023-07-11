

export function FormatDate(date:number){
  if(date){
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    var newDate = new Date(Number(date)).toLocaleDateString().split('/')
    return `${newDate[0]} de ${months[Number(newDate[1]) - 1]} de ${newDate[2]}`
  } 
}

export function FormatDateSmall(date:string){
  var newDate = new Date(date)
  return newDate.toLocaleDateString()
}

export function FormatDateVerySmall(date:number | Date){
  var newDate:Date | string = new Date(date)
  newDate = newDate.toLocaleDateString().toString()
  return newDate.substring(0, 5)
}
