#!/usr/bin/env bash
NODE_ENV=$1
DIRECTION=$2
DATABASE1=$3
DATABASE2=$4
DATABASE3=$5
DATABASE4=$6
DATABASE5=$7

databases=(
	${DATABASE1}
	${DATABASE2}
  ${DATABASE3}
  ${DATABASE4}
  ${DATABASE5}
)

if [ ${NODE_ENV} = "production" ]; then
  set -a
  . ./.env +e
  set +a
else
  set -a
  . ./run/env/${NODE_ENV}/.env
  set +a
fi

for i in "${databases[@]}"
do
	:
	if [[ ${i} ]]; then
	  echo -e "Migrating $i..."
	  ./node_modules/.bin/db-migrate ${DIRECTION}:${i} --config migrations/config.json -e ${i}
  fi
done
