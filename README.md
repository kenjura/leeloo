# Leeloo

A flat-file-based CMS. Aspirationally, it will:
+ Connect to your Dropbox (and maybe other cloud providers)
+ Serve Markdown, Mediawiki, HTML, and possibly other formats
+ Have a proper WYSIWYG editor
+ Use an auth provider such as Okta


# Local dev
+ Step 1: npm install (or yarn install)
+ Step 2: create a file /etc/leeloo.env (you can use [leeloo.env.example](./leeloo.env.example) as a base)
+ Step 3: npm start (or yarn start)
+ Step 4: load localhost:3005 in your browser (may have to change the URL if you modified the port)