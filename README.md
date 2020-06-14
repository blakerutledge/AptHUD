# Generic Node.js + Custom frontend web app

Add project specific info here.





### Installation

##### Dev-Ops
  production

  * Get a clean Ubuntu LTS instance on AWS or DO

  * Get a domain, point it to the nameservers of AWS or DO

  * On AWS or DO, setup a networking route via the admin website by creating:
  	an A record with `projectname.com` pointing to your server’s public IP address
  	a CNAME record with `www.projectname.com` as an alias of `projectname.com`
  	a CNAME record with `*.projectname.com` as an alias of `projectname.com`

  * SSH into the instance

  * Create [a user, install openssh, and configure the firewall](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04)
  
  * Install the [latest nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04).

  * Install Git with `sudo apt update`, and `sudo apt install git`

  * Clone this repo onto the instance somewhere like `/user/[username]/apps/projectname.com/`, and additionally in `/user/[username]/apps/stage.projectname.com/`. Ideally, use a dedicated ssh key for deployed access of the repo.

  * In `[ repo root ]/etc/` there is a file that is named the url of the project. If needed, modify the file name and contents, as it is an Nginx server block module, to route traffic on the appropriate domain to the appropriate port. Create a copy of this file in `/etc/nginx/sites-available/`
  
  * Run `sudo ln -s /home/user/apps/projectname.com/etc/projectname.com /etc/nginx/sites-available/` and `sudo ln -s /home/user/apps/stage.projectname.com/etc/stage.projectname.com /etc/nginx/sites-available/` to create a symlink and enable it.

  * Run `sudo ln -s /etc/nginx/sites-available/projectname.com /etc/nginx/sites-enabled/` and `sudo ln -s /etc/nginx/sites-available/stage.projectname.com /etc/nginx/sites-enabled/` to create a symlink and enable it.

  * Test Nginx config with `sudo nginx -t`

  * Install Lets Encrypt with `sudo add-apt-repository ppa:certbot/certbot` and `sudo apt install python-certbot-nginx`

  * Configure firewall with `sudo ufw allow 'Nginx Full'` and `sudo ufw delete allow 'Nginx HTTP'`

  * Create certs with `sudo certbot --nginx -d projectname.com -d www.projectname.com -d stage.projectname.com`

  * Test Nginx config with `sudo nginx -t`

  * Restart with `sudo systemctl restart nginx`



##### Build
  production & development

  * Install NVM, if not already installed ([OSX/Linux](https://github.com/nvm-sh/nvm#installation-and-update), [Windows](https://github.com/coreybutler/nvm-windows/releases)).

  * Using NVM, install and select the version of Node.js specified in `.nvmrc`. This is done in two commands, like `nvm install 12.13.1` and `nvm use 12.13.1`. The "use" step seems to be automatic on OSX and not on the Windows.

  * Install Yarn ([OSX/Linux](https://yarnpkg.com/lang/en/docs/install/#mac-stable), [Windows](https://yarnpkg.com/lang/en/docs/install/#windows-stable)).

  * Run `npm run installers`. This installs `pm2` globally, runs a task to create the `.env` file, and then installs the rest of the local runtime and development dependencies via yarn.

  * Modify the `.env` file (that was created during the installation process) to suit your environment. This includes specifying `development`, `stage`, or `production` for `NODE_ENV`, and adding any secret API keys. Reference the `etc/.env-example`. 



##### Serve
	production

  * Check in `.env` that the `PORT` matches that in the Nginx server block file, and that the `NODE_ENV` is set to `production`

  * Build the transpiled js in dist for server and frontend by running `npm run build`

  * Serve dist with `npm run serve`



##### Dev
	development

  * The default in `/env` for `NODE_ENV` is `development`

  * Watch with `npm run watch:server`, and in a new terminal `npm run watch:frontend`. Server will run in memory with babel-node, and the frontend will write to dist to be served out. Browser is hot-reloaded via socket communications, and build times are fairly quick with Parcel. 

  * You can optionally build portions of the app like `npm run build:frontend` and `npm run build:server`. New subtasks should be added to the master build script chain in `package.json`
