'use strict';

const
	promisify = require( 'util' ).promisify,
	readFile = promisify( require( 'fs' ).readFile ),
	writeFile = promisify( require( 'fs' ).writeFile ),
	mkdir = promisify( require( 'fs' ).mkdir ),
	path = require( 'path' ),
	{ getSiteMatrix } = require( './siteMatrix/siteMatrixFetcher.js' ),
	{ getPageViews } = require( './pageViews/pageViewsFetcher.js' ),
	{ getPageCounts } = require( './pageCounts/pageCountsFetcher.js' ),
	{ localizeNumber, getDefaultLocaleData } = require( './localization/siteMatrixLocalizer.js' ),
	{ generateAjaxTranslationFiles } = require( './localization/ajaxTranslationFilesGenerator.js' );

/**
 *
 * @param {Object} data
 */
async function writeJSONFile( data ) {
	const filepath = path.resolve( __dirname, '../data/wikipedia.json' );
	try {
		await readFile( filepath );
	} catch ( err ) {
		await mkdir( path.resolve( __dirname, '../data/' ), { recursive: true } );
	}
	await writeFile(
		filepath,
		JSON.stringify( data, null, 2 ),
		'utf-8'
	);
}

/**
 *
 */
async function init() {
	const siteMatrix = await getSiteMatrix(),
		pageViewsData = await getPageViews( siteMatrix, 'wiki' ),
		pageCountsData = await getPageCounts( siteMatrix, 'wiki' ),
		defaultLocaleData = await getDefaultLocaleData( 'en' );

	siteMatrix.wiki.forEach( ( site, index ) => {
		const pagecounts = pageCountsData[ index ].pagecounts,
			pageviews = pageViewsData[ index ].pagecounts,
			localizedPageCounts = localizeNumber( site.code, pagecounts );

		site.pageviews = pageviews;
		site.pagecounts = pagecounts;
		site.pagecountsLocalized = localizedPageCounts;

		if ( site.code === 'en' ) {
			Object.assign( site, defaultLocaleData );
		}
	} );

	await generateAjaxTranslationFiles( siteMatrix );

	await writeJSONFile( siteMatrix );

}

init();
