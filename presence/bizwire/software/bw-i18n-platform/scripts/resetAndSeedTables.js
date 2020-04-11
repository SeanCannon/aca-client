'use strict';

(function accommodateSeveralLoadFileQueries() {
  require('events').EventEmitter.defaultMaxListeners = Infinity;
}());

const R    = require('ramda'),
      path = require('path'),
      fs   = require('fs');

const DB = require('../server/core/utils/db');

const createAndExecuteQuery = query => DB.query([query, []]);

const init = db => {

  const MIGRATIONS_DIRECTORY = path.resolve(__dirname, `../sql/migrations/${db}`);
  const NODE_ENV             = R.pathOr('default', ['env', 'NODE_ENV'], process);

  const getLocalTestSqlPath = scriptName => {
    return path.resolve(__dirname, `../sql/bootstraps/${db}.${scriptName}.sql`);
  };

  const getLocalTestLoadFilesPathWindowsSafe = () => {
    return path.resolve(__dirname, '../run/env/' + NODE_ENV + '/seedData/' + db).replace(/\\/g, '\\\\');
  };

  const prefixDirectory = R.concat(MIGRATIONS_DIRECTORY + '/'),
        migrationFiles  = fs.readdirSync(MIGRATIONS_DIRECTORY);

  const migrationUpFileNames     = R.filter(R.test(/up/), migrationFiles).sort(),
        migrationUpFullFilePaths = R.map(prefixDirectory, migrationUpFileNames);

  const sqlMigrations = R.compose(
    R.join('\n\n'),
    R.map(R.partialRight(fs.readFileSync, ['utf8']))
  )(migrationUpFullFilePaths);

  const sqlCreateDatabase = fs.readFileSync(getLocalTestSqlPath('createDatabase'), 'utf8'),
        sqlSeedTables     = fs.readFileSync(getLocalTestSqlPath('seedTables'),     'utf8');

  const separateWithNewlines    = R.concat(R.__, '\n\n');
  const thenConcat              = R.flip(R.concat);
  const replacePathPlaceholder  = R.replace(/__PATH__/g,             getLocalTestLoadFilesPathWindowsSafe());
  const shimEnvDatabaseName     = R.replace(/__CORE_DB_NAME__/g,     process.env.CORE_DB_NAME);
  const shimEnvDatabaseHost     = R.replace(/__CORE_DB_HOST__/g,     process.env.CORE_DB_HOST);
  const shimEnvDatabaseUser     = R.replace(/__CORE_DB_USER__/g,     process.env.CORE_DB_USER);
  const shimEnvDatabasePassword = R.replace(/__CORE_DB_PASSWORD__/g, process.env.CORE_DB_PASSWORD);

  const RESET_AND_RESEED_SQL = R.compose(
    shimEnvDatabasePassword,
    shimEnvDatabaseHost,
    shimEnvDatabaseUser,
    shimEnvDatabaseName,
    replacePathPlaceholder,
    thenConcat(sqlSeedTables),
    separateWithNewlines,
    thenConcat(sqlMigrations),
    separateWithNewlines
  )(sqlCreateDatabase);

  return {
    reset : () => createAndExecuteQuery(RESET_AND_RESEED_SQL)
  };
};

module.exports = { init };
