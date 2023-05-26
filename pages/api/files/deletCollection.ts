import { db } from "../sdkFirebase";

export default async function deleteCollection(req, res) {
  console.log(req.body.path)
  const collectionRef = db.collection(req.body.path);
  const query = collectionRef.orderBy('__name__')

  return new Promise(async (resolve, reject) => {
    await deleteQueryBatch(db, query, resolve)
    .then(res.status(200).json('Arquivos excluidos com sucesso!!!'))
    .catch(reject);
  });
  
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(async () => {
    await deleteQueryBatch(db, query, resolve);
  });
}
