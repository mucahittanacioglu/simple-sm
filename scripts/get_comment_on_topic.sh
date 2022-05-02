#!/bin/bash

echo 'Please enter account near account:'

read ACCOUNT

echo 'Please enter topic name:'
read -r TOPIC_NAME

echo "Calling function to view comments on ${TOPIC_NAME} with account {$ACCOUNT}"

eval "near call legalalien.testnet get_comments_on_topic '{\"topic_name\":\"$TOPIC_NAME\"}' --accountId $ACCOUNT"