export {}

// import { getMessaging, getToken } from "firebase/messaging";
// import { app } from "firebase";
// import { toast } from "react-toastify";

// export default function main() {
//     const messaging = getMessaging(app);

//     Notification.requestPermission().then((permission) => {
//         if(permission === 'granted') {
//         getToken(messaging, {vapidKey: process.env.PUBLIC_VAPID_KEY}).then((currentToken) => {
//             if(currentToken) {
//             console.log(currentToken);
//             }
//         }).catch((err) => {
//             toast.error("Um erro ocorreu enquanto gerava o token: ", err);
//         })
//         }
//     })
// }