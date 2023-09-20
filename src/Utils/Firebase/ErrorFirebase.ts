import {toast} from 'react-toastify'

 interface Props{
  message:string
  code:string
 }

function ErrorFirebase({message, code}:Props) {
  var resultFunction = message
  if(code === "auth/too-many-requests"){        
    resultFunction = "Limite de tentativas de login excedido, tente novamente mais tarde."        
  } else if (code === "auth/wrong-password"){
    resultFunction = "Sua senha está incorreta."
  } else if(code === "auth/user-not-found"){
    resultFunction = "Este usuário não foi cadastrado."
  } else if(code === "auth/email-already-in-use"){
    resultFunction = "Este email ja foi cadastrado em nosso sistema." 
  } else if(code === "auth/email-already-exists"){
    resultFunction = "Já existe um usuário cadastrado com este email." 
  } else if(code === "auth/user-disabled"){
    resultFunction = "Este usuário foi desabilitado."
  } else if(code === "auth/invalid-email"){
    resultFunction = "O formato de email digitado não é aceito pelo nosso sistema."
  } else if(code === "auth/email-not-found"){
    resultFunction = "Este usuário não foi cadastrado no 2Docs."
  } else if(code === 'auth/internal-error'){
    resultFunction = "O limite de tentativas foi excedido, tente novamente mais tarde!"
  } else if(code === "auth/login-blocked"){
    return
  }
  
  throw toast.error(resultFunction);
}

export default ErrorFirebase
