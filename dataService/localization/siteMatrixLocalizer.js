'use strict';

const
	promisify = require( 'util' ).promisify,
	readFile = promisify( require( 'fs' ).readFile ),
	path = require( 'path' ),
	{ CONSTANTS } = require( '../utils/helpers.js' );

/**
 * Return a localized number given a language code and number.
 *
 * @param {number} lang
 * @param {string} number
 * @return {string}
 */
function localizeNumber( lang, number ) {

	let localizedNumber = Number( number );
	try {
		localizedNumber = new Intl.NumberFormat( lang ).format( number );
	} catch ( err ) {
		// assuming RangeError from above command caused by invalid lang code.
		localizedNumber = new Intl.NumberFormat( 'en' ).format( number );
	}

	// in case number is invalid, return original value, stringified instead,
	// since a successful localization returns a string as well.
	return ( localizedNumber === 'NaN' ) ? number : localizedNumber;
}

async function getDefaultLocaleData( langCode ) {
	const
		localeFilePath = path.resolve( CONSTANTS.LOCALE_DIR, `${langCode}.json` ),
		fileContent = await readFile( localeFilePath );
	return JSON.parse( fileContent );
}

module.exports = {
	localizeNumber,
	getDefaultLocaleData
};
