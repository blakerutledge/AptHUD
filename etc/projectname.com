server {
	
	listen 80;

	server_name projectname.com;

	client_max_body_size 100M; #100mb

	# Static site - - - - - - - - - - - - - - - - - - -

	#	root /home/blake/apps/projectname.com/dist/frontend;
    #	index index.html;
	#	location / {
	#	    try_files $uri $uri/ =404;
	#	}

	# - - - - - - - - - - - - - - - - - - - - - - - - - 



	# Node.js server  - - - - - - - - - - - - - - - - -

		location / {
			proxy_pass http://localhost:4001;
			proxy_http_version 1.1;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection 'upgrade';
			proxy_set_header Host $host;
			proxy_cache_bypass $http_upgrade;
	
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $remote_addr;
		}
	
	# - - - - - - - - - - - - - - - - - - - - - - - - - 

}