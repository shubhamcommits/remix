#!/bin/bash


instances=$(aws ec2 describe-instances --filters "Name=tag:Environment,Values=dev" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].PublicIpAddress" --output text)
echo "${instances}"

# Convert the output to a Bash array
IFS=$'\t' read -r -a public_ips <<< "$instances"

# Iterate over the array of public IP addresses and SSH into each instance
for public_ip in "${public_ips[@]}"; do
  echo $public_ip
done

exit 1