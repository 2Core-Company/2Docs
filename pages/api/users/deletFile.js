const {Spanner} = require('@google-cloud/spanner');

const spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

try {
  const [rowCount] = await database.runPartitionedUpdate({
    sql: 'DELETE FROM Singers WHERE SingerId > 10',
  });
  console.log(`Successfully deleted ${rowCount} records.`);
} catch (err) {
  console.error('ERROR:', err);
} finally {
  database.close();
}