var admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');
var serviceAccount = require("./serviceAccountKey.js");
import { getAuth } from 'firebase-admin/auth'


    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
        })
    }
    export const storage = new Storage({projectId:process.env.NEXT_PUBLIC_PROJECT_ID});
    export const db = admin.firestore();
        
export { getAuth }