handlebar-rider -w -i views -o public/javascripts/templates.js  > watchlog 2>&1 &
compass watch public/stylesheets/ > watchlog 2>&1 &
tail -f watchlog
