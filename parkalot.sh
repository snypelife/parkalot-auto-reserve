#!/bin/bash

usage() {
  cat <<HELP_USAGE
$0  <username> <password>

username       Your Parkalot username
password       Your Parkalot password
HELP_USAGE
}

if [ $# -eq 0 ]; then
  echo "No arguments provided"
  usage
  exit 1
fi

username=$1
password=$2

npm i && \
node . "$username" "$password"
