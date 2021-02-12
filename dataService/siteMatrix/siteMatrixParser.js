'use strict';

/**
 * Parse the siteMatrix data to remove all non-active
 * wikis and make the output easier to work with.
 *
 * @param {Object} siteMatrixObject
 * @return {Object}
 */
function parseSiteMatrix( siteMatrixObject ) {
	const sitematrix = Object.assign( {}, siteMatrixObject.sitematrix ),
		filteredSiteMatrix = {};
	delete sitematrix.count;

	Object.entries( sitematrix ).forEach( ( data ) => {
		const lang = data[ 1 ];

		if ( !lang.site ) {
			return;
		}

		lang.site.forEach( ( site ) => {
			filteredSiteMatrix[ site.code ] = filteredSiteMatrix[ site.code ] || [];

			if ( site.closed !== undefined ) {
				return;
			}

			filteredSiteMatrix[ site.code ].push( {
				code: lang.code,
				dbname: site.dbname,
				url: site.url,
				langName: lang.name,
				dir: lang.dir
			} );
		} );
	} );

	return filteredSiteMatrix;
}

module.exports = {
	parseSiteMatrix
};
