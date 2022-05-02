#!/bin/bash

echo 'Please enter near account:'

read ACCOUNT

echo 'Calling with account $ACCOUNT'

echo 'Please enter topic name:'
read -r TOPIC_NAME

eval "near call legalalien.testnet create_topic '{\"name\":\"$TOPIC_NAME\"}' --accountId $ACCOUNT"