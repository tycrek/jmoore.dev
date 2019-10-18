#!/bin/sh

cd /home/nodejs/jmdev2/
sudo git pull origin master
sudo systemctl restart nodejsd
echo Done
echo