'use strict';

const
	fetch = require( 'node-fetch' ),
	{ CONSTANTS, fetchError } = require( '../utils/helpers.js' ),
	{ parseSiteMatrix } = require( './siteMatrixParser.js' );

/**
 * Create a new URL object for the SiteMatrix API
 *
 * @return {URL}
 */
function createSiteMatrixUrl() {
	const siteMatrixParams = new URLSearchParams( {
			action: 'sitematrix',
			format: 'json',
			smsmtype: 'language',
			smstate: 'all',
			smlangprop: 'code|name|site|dir|localname',
			utf8: '1',
			formatversion: 'latest'
		} ),
		siteMatrixUrl = new URL( '/w/api.php', 'https://meta.wikimedia.org' );

	siteMatrixUrl.search = siteMatrixParams;
	return siteMatrixUrl;
}

/**
 * Request SiteMatrix data for metawiki.
 * This includes data about all Wikimedia sites.
 *
 * @async
 * @return {Promise<Object>}
 */
async function getSiteMatrix() {

	console.log( 'Fetching Sitematrix data' );

	const
		siteMatrixUrl = createSiteMatrixUrl(),
		siteMatrixResponse = await fetch(
			siteMatrixUrl.toString(),
			CONSTANTS.FETCH_OPTIONS
		);

	if ( !siteMatrixResponse.ok ) {
		const errorText = await siteMatrixResponse.text();
		throw fetchError( siteMatrixUrl, siteMatrixResponse.status, errorText );
	}

	const siteMatrixData = await siteMatrixResponse.json();

	return parseSiteMatrix( siteMatrixData );

}

module.exports = {
	getSiteMatrix
};
