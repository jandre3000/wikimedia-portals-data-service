# Wikimedia portals data service rebuild

This repo is work-in-progress experiement to rebuild the data layer of the Wikimedia portals repository.

The data service layer of the portals in concerned with basically the entire list of wikis for a given project,
their number of articles, page-views statistics, and translation messages.

The original implementation depends on data from Wikimedia's beta-cluster (called data-dumps) to retreave this data.

This implementation will use the information from stats.wikimedia.org instead.

