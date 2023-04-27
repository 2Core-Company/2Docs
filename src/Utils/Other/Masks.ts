export function PhoneMask(value:string | undefined){
    if(value != undefined){
      return value
      .replaceAll("(", "")
      .replaceAll("(", "")
      .replaceAll("-", "")
      .replaceAll("-", "")
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/^(\d{2})(\d)/g,"($1) $2")
      .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    }
    return ""
}

export function CNPJMask({value, setDataUser}:{value:string | undefined, setDataUser:Function}){
  const text = CreateCNPJMask(value)
  return setDataUser(dataUser => {return {...dataUser, cnpj:text}})
}

export function CreateCNPJMask(value:string | undefined){
  if(value){
    return value
    .replace(/\D+/g, '')
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
  }
}