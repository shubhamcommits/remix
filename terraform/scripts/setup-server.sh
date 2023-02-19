#!/bin/bash

# Set Runtime Variables
APPS_DIR="/home/ec2-user/apps"

# Update Packages
sudo yum update -y

# Install git
sudo yum install git -y

# Install nginx
sudo amazon-linux-extras install nginx1.12

# Start nginx
sudo systemctl start nginx

# Enable nginx
sudo systemctl enable nginx

# Setup Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

# Install yarn
sudo yum install yarn -y

# Install pm2
sudo npm install -g pm2

# Enable PM2 Root Service
sudo systemctl enable pm2-root

# Remove the configuration file
sudo rm -rf /etc/nginx/nginx.conf

# Create the new configuration and map port 3000
sudo cat > /etc/nginx/nginx.conf << 'EOF'
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

# Run nginx test
nginx -t

# Restart the system
sudo systemctl restart nginx

# Return the Status
exit 1
