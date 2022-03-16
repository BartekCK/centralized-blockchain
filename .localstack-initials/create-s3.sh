#!/bin/sh

echo 'Creating s3 bucket'

awslocal s3api create-bucket --bucket block --region us-east-2

awslocal s3api list-buckets
