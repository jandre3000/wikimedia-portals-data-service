'use strict';

/**
 * Fetches all pageCount data on a per-site basis.
 * Data is fetched a monthly time-range from https://stats.wikimedia.org
 */

const
	{ getMonthlyDateRange } = require( '../utils/helpers.js' ),
	{ batchFetch } = require( '../utils/batchFetcher' );

/**
 * Creates a URL object used to fetch the pageCount data for a specific site.
 *
 * @param {string} fullSiteUrl
 * @param {string} endDate
 * @return {URL}
 */
function createPageCountsUrl( fullSiteUrl, endDate ) {
	const
		siteUrl = new URL( fullSiteUrl ),
		base = 'https://wikimedia.org',
		path = [
			'/api',
			'rest_v1',
			'metrics',
			'edited-pages',
			'new',
			siteUrl.host,
			'all-editor-types',
			'content',
			'monthly',
			'1980010100', // beginning of time
			endDate
		].join( '/' ),
		url = new URL( path, base );

	return url;
}

async function getPageCounts( siteMatrixData, project ) {
	const
		projectSitesData = [ ...siteMatrixData[ project ] ],
		now = new Date();

	// we want the first date of this month
	now.setMonth( now.getMonth() + 1, 1 );

	const { endDate } = getMonthlyDateRange( now );
	const urls = projectSitesData.map( ( siteData ) => {
		return {
			url: createPageCountsUrl( siteData.url, endDate ),
			label: siteData.dbname
		};
	} );

	const pageCountsData = await batchFetch( urls, 'Updating page-counts' );
	return pageCountsData;
}

module.exports = { getPageCounts };
