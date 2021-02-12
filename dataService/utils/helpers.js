'use strict';

const
	path = require( 'path' );

/**
 * Returns an object containing {startDate, endDate} where the
 * startDate is the first date of the month and endDate is the
 * last day of the month based on the month of the given input date.
 *
 * @param {Date} startDate
 * @return {Object}
 */
function getMonthlyDateRange( startDate ) {
	const
		start = new Date( startDate ),
		end = new Date( start ),
		formatter = new Intl.DateTimeFormat( 'en-us',
			{
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				timeZone: 'UTC'
			} );

	// Set start month to previous month.
	start.setUTCMonth( start.getUTCMonth() - 1 );
	// Set start date to first day of previous month.
	start.setUTCDate( 1 );
	// Set end date to the day before the first day of this month
	// (i.e. the last day of previous month)
	end.setUTCDate( 0 );

	function splitFormattedDateObj( obj, { value, type } ) {
		if ( /month|day|year/.test( type ) ) {
			obj[ type ] = value;
		}
		return obj;
	}

	const { day: startDay, month: startMonth, year: startYear } = formatter
		.formatToParts( start )
		.reduce( splitFormattedDateObj, {} );

	const { day: endDay, month: endMonth, year: endYear } = formatter
		.formatToParts( end )
		.reduce( splitFormattedDateObj, {} );

	return {
		startDate: startYear + startMonth + startDay + '00', // (00 means midnight)
		endDate: endYear + endMonth + endDay + '00'
	};

}

/**
 * Constants
 */
const CONSTANTS = Object.freeze(
	{
		LOCALE_DIR: path.resolve( __dirname, '../../l10n' ),
		DATA_DIR: path.resolve( __dirname, '../../data' ),
		DATA_LOCALE_DIR: path.resolve( __dirname, '../../data/l10n' )
	}
);

module.exports = {
	getMonthlyDateRange,
	CONSTANTS
};
