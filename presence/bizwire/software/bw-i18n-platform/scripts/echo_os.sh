#!/usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
 echo "MAC"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
 echo "LINUX"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
 echo "WINDOWS" # 32 bit
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
  echo "WINDOWS" # 64 bit
fi
