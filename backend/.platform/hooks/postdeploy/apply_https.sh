#!/bin/bash

# Apply HTTPS configuration after deployment
if [ -f "/etc/letsencrypt/live/anatoliahorizon.com/fullchain.pem" ]; then
    echo "SSL certificate found, applying HTTPS configuration..."
    
    # Create HTTPS config file
    cat > /tmp/https-final.conf <<'EOF'
server {
  listen 80;
  server_name anatoliahorizon.com www.anatoliahorizon.com;

  location /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl;
  server_name anatoliahorizon.com www.anatoliahorizon.com;

  ssl_certificate /etc/letsencrypt/live/anatoliahorizon.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/anatoliahorizon.com/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

    # Remove default config
    rm -f /etc/nginx/conf.d/default.conf
    
    # Copy HTTPS config
    cp /tmp/https-final.conf /etc/nginx/conf.d/https.conf
    
    # Test and reload nginx
    nginx -t && nginx -s reload
    
    echo "HTTPS configuration applied successfully"
else
    echo "SSL certificate not found, keeping HTTP only"
fi
