# More Immediate
+ [ ] clean up all CSS to a minimum of confusion (no more article, article-view, #mainContent, .mainContent hell)
+ [ ] restructure components so TopMenu can receiving route params
+ [ ] clean up TODO.md, organize first by milestone, then functional area (and remove stale TODOs)

# Bundle optimization
+ [ ] Use remarkable for md parsing, replacing markdown

# Dropbox integration
+ [ ] MVP
  + [ ] Dropbox API
    + [x] Read files from Dropbox, not local file system
    + [x] Maintain a local cache to minimize Dropbox hits
    + [ ] Write to Dropbox
  + [ ] Feature parity
    + [ ] List all articles page
    + [ ] Search for article (fileName only)
    + [ ] Use article list to denote which links are alive or dead
+ [ ] v2
  + [ ] Use an external cache that survives reboots and can scale (e.g. memcached, redis)
  + [ ] Don't delete content from cache when it expires. Rather, show the stale content, notify user that it is stale and is being refreshed, then refresh
  + [ ] Get revision list, restore revision
  + [ ] Attribute edit to correct user (or at least annotate the edit somehow)
  + [ ] App acts as a daemon, slowly building a complete copy of the wiki root on the local disk (or redis?), then uses webhooks to keep it current

# Architecture / Best Practices
+ [ ] Find a way to use /:db/:path/:action with paths containing slashes
+ [ ] ArticleLoader should use react-router to parse location (?)

# Immediate
+ [ ] Pass correct DB to wikiToHtml

# Un-hack
+ [ ] Switch from style.leeloo to style

# Core Functionality

+ [ ] Windows/Linux issue handling
+ [ ] Error checking
  + [ ] path/_index vs path.txt
  + [ ] no docRoot
+ [ ] Deprecation
  + [ ] Replace _home with _index (maybe?)
  + [ ] Migration scripts
  + [ ] Migration UI
+ [ ] Draft mode
+ [ ] Dropbox integration
+ [ ] Clean up CSS
+ [ ] Login
  + [ ] On login, redirect to where you actually were before logging in

# Maybe
+ [ ] Make rendering isomorphic
+ [ ] TOC and sectioning logic done on HTML in frontend, separate from render


# Done, I guess?
+ [x] Implement markdown parser
+ [?] Security
+ [?] UI Basics
  + [?] Routing
  + [ ] Components?
  + [ ] Edit mode
+ [?] Improve skanky-ass hack for State.getDB()