'use strict';

const
	promisify = require( 'util' ).promisify,
	readFile = promisify( require( 'fs' ).readFile ),
	writeFile = promisify( require( 'fs' ).writeFile ),
	access = promisify( require( 'fs' ).access ),
	mkdir = promisify( require( 'fs' ).mkdir ),
	path = require( 'path' ),
	crypto = require( 'crypto' ),
	glob = require( 'glob' ),
	{ CONSTANTS } = require( '../utils/helpers.js' );

async function promiseGlob( pattern, options ) {
	return new Promise( ( resolve, reject ) => {
		glob( pattern, options, ( err, files ) => err === null ? resolve( files ) : reject( err ) );
	} );
}

/**
 * @param {Object} siteMatrix
 * @param {string} lang
 * @param langCode
 */
function filterSiteMatrixSitesForLang( siteMatrix, langCode ) {
	const
		matchingSiteMatrixData = {};

	for ( const [ project, ProjectSites ] of Object.entries( siteMatrix ) ) {
		const matchingSite = ProjectSites.filter( ( site ) => site.code === langCode );
		if ( matchingSite.length ) {
			matchingSiteMatrixData[ project ] = matchingSite[ 0 ];
		}
	}

	return matchingSiteMatrixData;
}

/**
 *
 * @param {Object} siteMatrix
 */
async function generateAjaxTranslationFiles( siteMatrix ) {
	const
		localeFiles = await promiseGlob( path.resolve( CONSTANTS.LOCALE_DIR, '*.json' ) ),
		maniphest = {};

	for ( const file of localeFiles ) {
		const
			hash = crypto.createHash( 'sha1' ),
			langCode = path.basename( file, '.json' ),
			fileContentText = await readFile( file, 'utf8' ),
			fileContentData = JSON.parse( fileContentText ),
			siteMatrixLangData = filterSiteMatrixSitesForLang( siteMatrix, langCode );

		for ( const [ project, siteMatrixData ] of Object.entries( siteMatrixLangData ) ) {
			if ( fileContentData[ project ] ) {
				Object.assign( fileContentData[ project ], siteMatrixData );
			}
		}

		const
			filehash = hash.update( JSON.stringify( fileContentData, null, '\t' ) ).digest( 'hex' ).substring( 0, 6 ),
			filenameHashed = `${langCode}-${filehash}.json`;

		maniphest[ langCode ] = filehash;

		try {
			await access( CONSTANTS.DATA_LOCALE_DIR );
		} catch ( err ) {
			await mkdir( CONSTANTS.DATA_LOCALE_DIR );
		}
		await writeFile( path.resolve( CONSTANTS.DATA_LOCALE_DIR + '/' + filenameHashed ), JSON.stringify( fileContentData, null, '\t' ), 'utf8' );
	}
	await writeFile( path.resolve( CONSTANTS.DATA_LOCALE_DIR + '/maniphest.json' ), JSON.stringify( maniphest, null, '\t' ), 'utf8' );
}

module.exports = {
	generateAjaxTranslationFiles
};
