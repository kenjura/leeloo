# On db, path, and wikilinks

So I often forget why I'm bothering with "db" and "path", when I could just use location? After all, I don't need db for style or menu if I can just walk up the folder structure, right? So what's it for?

Well, it's simple: db is required to generate URLs to view and edit articles, silly. Given [[Foobar]], how do you know the true url (e.g. /baz/foobar)?

Obviously, this is broken. Supporting deep paths means this logic doesn't work anyway, and has also opened up a new can of worms: how does one create wikilinks when editing a Markdown, HTML, or YAML file? I mean, I could theoretically support a globally-unique article name, along with the [[Article Name]] syntax...but that isn't valid MD/HTML/YML.

The most direct approach would be:
+ Require properly-formatted paths (preferably relative) in all documents, except legacy (see below)
+ Use a WYSIWYG or other helper in-browser to aid with links
+ Use Dropbox fileList to figure out which file is meant by "/db/foobar"
  + Yell at user if there are duplicates, and ask whether they want to delete dupes or rename them
+ Provide a "move this file" feature in the app, which finds all links to the file and corrects them
+ Legacy mode: support old-style [[Article Name]] wikilinks (in all formats or just wikitext?), which always render as /\_search/Article Name, which will consider the Referer to determine DB and redirect to the appropriate URL (with a notice, perhaps)
