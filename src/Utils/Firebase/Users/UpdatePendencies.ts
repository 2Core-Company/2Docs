import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../../../firebase";

interface Props {
    id_company: string
    id_user: string
    action: 'sum' | 'subtraction'
}

export async function UpdatePendencies({ id_company, id_user, action }: Props) {
    const sfDocRef = doc(db, "companies", id_company, 'clients', id_user);
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);
            if (!sfDoc.exists()) {
                throw "Document does not exist!";
            }
            var newPendencies
            if (action === 'sum') {
                newPendencies = sfDoc.data().pendencies + 1;
            } else if (action === 'subtraction') {
                newPendencies = sfDoc.data().pendencies - 1;
            }
            transaction.update(sfDocRef, { pendencies: newPendencies });
        });

    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}