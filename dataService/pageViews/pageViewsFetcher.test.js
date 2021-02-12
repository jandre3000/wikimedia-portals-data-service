'use strict';

const
	{ createPageViewsUrl } = require( './pageViewsFetcher' );

test( 'createPageViewsUrl returns a URL object', () => {
	const pageViewsUrl = createPageViewsUrl( 'https://en.wikipedia.org', '01012020', '01022020' ),
		expectedValue = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/aggregate/en.wikipedia.org/all-access/user/monthly/01012020/01022020';

	expect( pageViewsUrl.toString() ).toEqual( expectedValue );
} );
