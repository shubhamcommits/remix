#!/bin/bash

# Update Yum Repository
sudo yum update -y

# Install git
sudo yum install git -y

# Install Nginx
sudo amazon-linux-extras install nginx1.12
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16

# Install pm2 globally
sudo npm install -g pm2

# Setup Directory
mkdir /apps

# Change Directory
cd /apps

# Setup Code
git clone https://github.com/shubhamcommits/remix.git

# Install Dependencies
npm install
npm run build

# Setup the nginx configuration
cat > /etc/nginx/nginx.conf <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
          proxy_pass          http://localhost:3000;
          proxy_set_header    Host              $host;
          proxy_set_header    X-Real-IP         $remote_addr;
          proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
          proxy_set_header    X-Client-Verify   SUCCESS;
          proxy_set_header    X-Client-DN       $ssl_client_s_dn;
          proxy_set_header    X-SSL-Subject     $ssl_client_s_dn;
          proxy_set_header    X-SSL-Issuer      $ssl_client_i_dn;
          proxy_set_header    X-Forwarded-Proto http;
          proxy_read_timeout 1800;
          proxy_connect_timeout 1800;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
EOF 

exit 1
