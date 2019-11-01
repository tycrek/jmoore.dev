#!/bin/sh

echo 'Pulling changes from Git (master)...'
git pull origin master\
&& echo 'Done'\
|| echo 'Failed' && exit 1

# Update modules
echo 'Updating npm packages...'
npm i\
&& echo 'Done'\
|| echo 'Failed' && exit 1

echo 'Restarting systemd service...'
systemctl restart node-jmoore.dev.service\
&& echo 'Done'\
|| echo 'Failed' && exit 1

echo 'Website has been updated!'; exit 0