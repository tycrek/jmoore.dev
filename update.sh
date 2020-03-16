#!/bin/sh

echo
echo 'Pulling changes from Git (master)...'
git pull origin master\
&& echo 'Done'\
|| echo 'Failed'

# Update modules
echo
echo 'Updating npm packages...'
npm i\
&& echo 'Done'\
|| echo 'Failed'

# Fix permissions
echo
echo 'Fixing permissions...'
chown -R nodejs:nodejs .\
&& echo 'Done'\
|| echo 'Failed'

echo
echo 'Restarting systemd service...'
systemctl restart node-jmoore.dev.service nginx.service varnish.service\
&& echo 'Done'\
|| echo 'Failed'

echo
echo 'Website has been updated!'; exit 0
