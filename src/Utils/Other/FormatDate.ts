

export function FormatDate(date: number){
  if(date){
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    let newDate = new Date(Number(date)).toLocaleDateString().split('/')
    return `${newDate[0]} de ${months[Number(newDate[1]) - 1]} de ${newDate[2]}`
  } else {
    return "Data não inserida corretamente."
  }
}

export function FormatHours(date: number) {
  if(date){
    return new Date(Number(date)).toLocaleTimeString();    
  } else {
    return "Data não inserida corretamente."
  }
}

export function FormatDateSmall(date: string){
  var newDate = new Date(date)
  return newDate.toLocaleDateString()
}

export function FormatDateVerySmall(date: number | Date){
  var newDate:Date | string = new Date(date)
  newDate = newDate.toLocaleDateString().toString()
  return newDate.substring(0, 5)
}
