import {toast} from 'react-toastify'

 interface Props{
  message:string
  code:string
 }

function ErrorFirebase({message, code}:Props) {
      if(code === "auth/too-many-requests"){        
        message = "Limite de tentativas de login excedido, tente novamente mais tarde."        
      } else if (code === "auth/wrong-password"){
        message = "Sua senha está incorreta."
      } else if(code === "auth/user-not-found"){
        message = "Este usuário não foi cadastrado."
      } else if(code === "auth/email-already-in-use"){
        message = "Este email ja foi cadastrado em nosso sistema." 
      } else if(code === "auth/email-already-exists"){
        message = "Já existe um usuário cadastrado com este email." 
      } else if(code === "auth/user-disabled"){
        message = "Este usuário foi desabilitado."
      } else if(code === "auth/invalid-email"){
        message = "O formato de email digitado não é aceito pelo nosso sistema."
      }
      
      throw toast.error(message);
}

export default ErrorFirebase
