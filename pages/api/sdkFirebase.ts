var admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

var serviceAccount = require("./serviceAccountKey.json");

import { getAuth } from 'firebase-admin/auth'

    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.DATABASEURL
        });
    }
    export const storage = new Storage({projectId:process.env.PROJECT_ID});
    export const db = admin.firestore();

    
        
export { getAuth }