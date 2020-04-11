#!/usr/bin/env bash

EXAMPLE_COMMAND="yarn create-migration storeVisitAuthorizedBy coreDb CORE_DB"

####
# Using db-migrate behind the scenes. It makes some assumptions on where files should live,
# which makes it a bit difficult to isolate migrations for specific databases and whatnot,
# so most of this script just renames/moves files.
#
# We also do some string replace action in our migration SQL so we can rename the actual
# database on AWS to something random, reference it with an env var, and this will still work.
#
# Run like EXAMPLE_COMMAND
####

if [ $# -lt 3 ]; then
  echo "Error: Missing $((3 - $#)) argument. Expected [name] [database] [database_const]. Run like '${EXAMPLE_COMMAND}'"
  exit 0
fi

NAME=$1
DATABASE=$2
DATABASE_CONST=$3
NODE_JS_STRING_REPLACE_CODE="      data = data.replace(/__${DATABASE_CONST}_NAME__/g, process.env.${DATABASE_CONST}_NAME);"
LINES_IN_GENERATED_MIGRATION_JS_TO_ADD_NODE_JS_STRING_REPLACE_CODE=(28 44)

echo -e "Creating migration for ${DATABASE} called ${NAME}..."

./node_modules/.bin/db-migrate create ${NAME} --config ./migrations/config.json -e ${DATABASE} --sql-file

mv ./migrations/sqls/* ./sql/migrations/${DATABASE}
rmdir ./migrations/sqls

for file in `find ./migrations/*.js`
do

  for line in "${LINES_IN_GENERATED_MIGRATION_JS_TO_ADD_NODE_JS_STRING_REPLACE_CODE[@]}"
  do
    cp ${file} ./migrations/foo
    perl -lpe "print '${NODE_JS_STRING_REPLACE_CODE}' if $. == ${line}" ./migrations/foo > ${file}
    rm ./migrations/foo
  done

  perl -pi.bak -e "s/sqls/\/..\/..\/sql\/migrations\/${DATABASE}\//g" ${file}
  rm ${file}.bak

done

mv ./migrations/*-${NAME}.js ./migrations/${DATABASE}

echo "[INFO] Moved migration files to appropriate folders for this app. (./sql/migrations/${DATABASE}/*.sql) and (./migrations/${DATABASE}*.js)"
