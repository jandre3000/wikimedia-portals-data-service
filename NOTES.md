# Purpose

Fetch all the portal statistics needed to populate
the homepage, cache the results, then feed that data into
the template files for rendering.

# Method

The page https://meta.wikimedia.org/wiki/List_of_Wikipedias
is actually populated by this page!
https://wikistats.wmcloud.org/display.php?t=wp

And that site has an API!

https://wikistats.wmcloud.org/api.php?action=dump&table=wikipedias&format=csv
It'a different from the stats.wikimedia.org site though.

1. Get a CSV of all wikis (from wikistats)
2. Sort the wikis and group them by number of articles
3. Merge that data with the localization data from translatewiki


