#!bash
for port in "$@"
do
    pid=$(lsof -n -iTCP:"$port" | grep LISTEN | awk '{ print $2 }')
    if [ -n "$pid" ]; then kill -9 "$pid"; fi
done