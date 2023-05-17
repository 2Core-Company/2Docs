var admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

var serviceAccount = require("./serviceAccountKey.json");

import { getAuth } from 'firebase-admin/auth'
    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    export const storage = new Storage({projectId:'docs-dc26e'});
    export const db = admin.firestore();

    
        
export { getAuth }