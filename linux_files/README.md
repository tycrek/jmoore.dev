These files are meant for running as a proxied service on an Ubuntu machine (currently using: Ubuntu 18.04)

**node-jmoore.dev.service** is a systemd file.

- Placed in `/etc/systemd/system/`
- Enabled using `systemctl enable` to ensure it runs on startup
- The `WorkingDirectory` and `ExecStart` may need to be modified depending on the environment
- A system user/group named `nodejs` should exist on the system
- `nodejs` user should have access to the `WorkingDirectory`

**jmoore.dev.conf** is an Apache Web Server VirtualHost config.

- Placed in `/etc/apache2/sites-available`
- Enabled using `a2ensite` (remember to reload Apache)
- `APACHE_CERT` and `APACHE_KEY` can be set in `/etc/apache2/envvars`
  - `APACHE_CERT` is a Let's Encrypt `fullchain.pem`
  - `APACHE_KEY` is a Let's Encrypt `privkey.pem`
- Apache should be listening on ports 80 and 443 and allowed through `ufw`

**update-jmoore.dev.sh** is a Bash script for quickly updating from Git. Must be run as `sudo`.