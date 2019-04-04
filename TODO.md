# More Immediate
+ [ ] clean up all CSS to a minimum of confusion (no more article, article-view, #mainContent, .mainContent hell)
+ [ ] restructure components so TopMenu can receiving route params
+ [ ] clean up TODO.md, organize first by milestone, then functional area (and remove stale TODOs)

# Dropbox integration
+ [ ] MVP
  + [x] Read files from Dropbox, not local file system
  + [x] Maintain a local cache to avoid Dropbox hits (threshold one: do not hit Dropbox; threshold two: load from cache, then hit Dropbox; threshold three: go right to Dropbox)
  + [ ] Write to Dropbox
  + [ ] Get revision list, restore revision
  + [ ] Attribute edit to correct user (or at least annotate the edit somehow)
+ [ ] Questions to resolve
  + [ ] Should the request go through backend, or just go direct to Dropbox? 

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