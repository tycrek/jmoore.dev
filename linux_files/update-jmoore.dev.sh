#!/bin/sh

cd /home/nodejs/jmoore.dev/
sudo git pull origin master
sudo systemctl restart node-jmoore.dev.service
echo Done
echo
