#!/bin/sh

echo 'Creating queues'

awslocal sqs create-queue --queue-name sample-queue

awslocal sqs list-queues
