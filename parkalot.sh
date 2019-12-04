#!/bin/bash

usage() {
  cat <<HELP_USAGE
$0  <username> <password>

username       Your Parkalot username
password       Your Parkalot password
HELP_USAGE
}

username=$1
password=$2

if [ $# -eq 0 ] || [ -z "$username" ] || [ -z "$password" ]; then
  echo "Required arguments are missing..."
  echo ""
  usage
  exit 1
fi

npm i && \
node . "$username" "$password"
