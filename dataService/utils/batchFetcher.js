'use strict';

const fetch = require( 'node-fetch' ),
	Bottleneck = require( 'bottleneck' ),
	ProgressBar = require( './ProgressBar.js' ),
	fetchOptions = {
		headers: {
			'user-agent': 'wikimediaPortalsDataService/0.0 (https://meta.wikimedia.org/wiki/User:JDrewniak_(WMF); jdrewniak@wikimedia.org) node-fetch/2.6.1'
		}
	},
	limiter = new Bottleneck( {
		minTime: 20,
		maxConcurrent: 20
	} );

/**
 * Create a new error resulting from a failed network request.
 *
 * @param {string} url
 * @param {string} status
 * @param {string} responseText
 * @return {Error}
 */
class FetchError extends Error {
	constructor( url, status, responseText ) {
		super();
		this.name = 'FetchError';
		this.message = `
	---------------------------
	Fetching the following URL:
	${url}
	FAILED with the code: ${status}
	RESPONSE:
	${responseText}
	---------------------------`;
	}
}

/**
 *
 * @param {Object} res
 * @return {Object|fetchError}
 */
function checkStatus( res ) {
	if ( res.ok ) { // res.status >= 200 && res.status < 300
		return res;
	} else {
		throw new FetchError( res.url, res.statusText );
	}
}

/**
 * @param urlObj
 * @param sites
 * @param label
 */
function batchFetch( sites, label ) {
	const
		requests = [],
		progressBar = new ProgressBar( label );

	progressBar.start( sites.length, 1 );

	for ( const site of sites ) {
		requests.push(
			limiter.schedule( () => {
				return fetch( site.url, fetchOptions )
					.then( checkStatus )
					.then( ( result ) => result.json() )
					.then( ( body ) => {
						progressBar.update( site.label );
						return body;
					} )
					.catch( ( err ) => {
						throw new FetchError( site.url, err.message );
					} );
			} )
		);
	}

	return Promise
		.all( requests )
		.then( ( responses ) => {
			progressBar.update( ' done!' );
			progressBar.stop();
			return responses;
		} );
}

module.exports = {
	checkStatus,
	FetchError,
	batchFetch
};
