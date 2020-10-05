These files are meant for running as a proxied service on an Ubuntu machine (currently using: Ubuntu 18.04)

## Listeners
- ~~`0.0.0.0:80`: Nginx (redirects to port 443 for SSL)~~
- ~~`0.0.0.0:443`: Nginx (reverse proxy to Varnish HTTP Cache server)~~
- `0.0.0.0:80/443`: Caddy (modern alternative to Nginx. Used for reverse proxy to varnish)
- `127.0.0.1:6081`: Varnish HTTP Cache server (caches requests and acts as reverse proxy for Node.js)
- `127.0.0.1:8235`: Node.js (Express) HTTP server