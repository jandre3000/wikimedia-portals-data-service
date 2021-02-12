'use strict';

/**
 * Fetches all pageview data on a per-site basis.
 * Data is fetched a monthly time-range from https://stats.wikimedia.org
 */

const
	{ getMonthlyDateRange } = require( '../utils/helpers.js' ),
	{ batchFetch } = require( '../utils/batchFetcher' );

/**
 * Creates a URL object used to fetch the pageViews data for a specific site.
 *
 * @param {string} fullSiteUrl
 * @param {string} startDate
 * @param {string} endDate
 * @return {URL}
 */
function createPageViewsUrl( fullSiteUrl, startDate, endDate ) {
	const
		siteUrl = new URL( fullSiteUrl ),
		base = 'https://wikimedia.org',
		path = [
			'/api',
			'rest_v1',
			'metrics',
			'pageviews',
			'aggregate',
			siteUrl.host,
			'all-access',
			'user',
			'monthly',
			startDate,
			endDate
		].join( '/' ),
		url = new URL( path, base );

	return url;
}

async function getPageViews( siteMatrixData, projectCode ) {
	const
		sitesData = [ ...siteMatrixData[ projectCode ] ],
		{ startDate, endDate } = getMonthlyDateRange( new Date() ),
		urls = sitesData.map( ( siteData ) => {
			console.log( siteData );
			return {
				url: createPageViewsUrl( siteData.url, startDate, endDate ),
				label: siteData.dbname
			};
		} );

	const pageViewsData = await batchFetch( urls, 'Updating page-views' );

	const siteDataWithPageViews = sitesData.reduce( ( mergedSiteData, val, i ) => {
		val.views = pageViewsData[ i ].items[ 0 ].views;
		mergedSiteData.push( val );
		return mergedSiteData;
	}, [] );

	return siteDataWithPageViews;
}

module.exports = { getPageViews, createPageViewsUrl };
