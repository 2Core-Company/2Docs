

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

export function FormatDateSmall(date: number){
  var newDate = new Date(date)
  return newDate.toLocaleDateString()
}

export function FormatDateVerySmall(date: number | Date){
  var newDate:Date | string = new Date(date)
  newDate = newDate.toLocaleDateString()
  newDate = newDate.substring(0, 5)
  return newDate
}

export function FormatDateToPageEvent(date:number){
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const days = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sabado"]
  var newDate = new Date(date)
  const nameDay = days[newDate.getDay()]
  const nameMonth = months[newDate.getMonth()]
  const hours = newDate.getHours().toString().padStart(2, '0')
  const minutes = newDate.getMinutes().toString().padStart(2, '0')
  return `${nameDay}, ${newDate.getDate()} de ${nameMonth}, ${hours}:${minutes}`
}
