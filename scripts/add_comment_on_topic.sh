#!/bin/bash

echo 'Please enter near account:'

read ACCOUNT

echo 'Please enter topic you want to comment on:'

read -r TOPIC_NAME

echo 'Please enter your comment:'

read -r COMMENT

eval "near call legalalien.testnet add_comment_to_topic '{\"topic_name\":\"$TOPIC_NAME\",\"comment\":\"$COMMENT\"}' --accountId $ACCOUNT"