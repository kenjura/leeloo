# Down with db

The concept of "db" is a pain in the ass. Why does it exist?
+ Helps us find canonical menu and style
+ Helps us find db root

Do we need this? Well, for canonical menu and style, couldn't we just send the current article path, and the backend could walk up the directory structure until it finds one? Seems easy enough, and it's not much more egregious than the amound of fiddly-winking in the filesystem already.

So about the second...what is the db root? It's just for finding \_home, right? If you land on /mywiki, and there's a \_home there, you're good to go. If your menu has a Home link, it'll be pointing to the right place...

Except it won't. Because db is used to create wikilinks. And so we return to the central problem with supporting subfolders of the dbroot.

Here's how this could work:
+ Rendering an article: try the exact path, then add extensions in order, then try the path as a folder with \_home or index, then give up.
+ Rendering menu or style: start with the provided path, look for sibling menu/style, crawl up the folder tree until its found, or until you can't go any further (you're in wikiroot)
+ Rendering a link: crawl the entire tree, make a list of every article. Enforce unique article names (except home/index/menu/style) on client and server. Given article name, look up full path and replace. Works for the menu too.
  + Except no, because without db, the domain for unique names is the entire wikiroot. And that dog won't hunt.
  + Option 2: all links must be full paths. This is necessary for Markdown and HTML users in any case. The client can help you look up a full path by its article name (preference for fewest # of folder hops).

