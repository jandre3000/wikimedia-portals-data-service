'use strict';

const cliProgress = require( 'cli-progress' );

class ProgressBar {
	constructor( title ) {
		this.bar = new cliProgress.SingleBar(
			{
				format: `{bar} | {value}/{total} ({percentage}%) | ${title}: {site}`
			},
			cliProgress.Presets.shades_classic );
	}

	start( length, startIndex ) {
		this.bar.start( length, startIndex );
	}

	update( site ) {
		this.bar.increment( { site: 'updating ' + site } );
	}

	stop() {
		this.bar.stop();
	}
}
module.exports = ProgressBar;
