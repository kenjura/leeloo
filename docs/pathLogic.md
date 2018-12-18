
# path rules
1. exact file path, with extension
2. path to a file without extension (try extensions in order)
3. path to a folder with an index (try extensions in order)
4. file not found

note: if 2 and 3 are both true, prefer 2, but warn user that 3 is being obscured

# extension order
1. html
2. md
3. txt (assume wikitext)

For now...