import { db } from "../sdkFirebase";

export default async function DeleteCollection(req, res) {
  const collectionRef = db.collection(req.body.path);
  const query = collectionRef.orderBy('__name__')

  return new Promise(async (resolve, reject) => {
    await deleteQueryBatch(db, query, resolve)
    .then(res.status(200).json({messagem:'Arquivos excluidos com sucesso!!!'}))
    .catch((error) => {
      res.status(400).json(error)
    });
  });
  
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();
  var size = 0

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    size = doc.data().size + size
    batch.delete(doc.ref);
  });
  await batch.commit();
  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(async () => {
    await deleteQueryBatch(db, query, resolve);
  });
}
