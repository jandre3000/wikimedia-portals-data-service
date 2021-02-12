'use strict';

const
	fetch = require( 'node-fetch' ),
	{ batchFetch, FetchError } = require( './batchFetcher.js' );

jest.mock( 'node-fetch' );

test( 'batchFetcher returns an array of values', async () => {
	const responsePromise = Promise.resolve(
		{
			json: async () => { return { foo: 'bar' }; },
			ok: true
		}
	);

	fetch.mockReturnValue( responsePromise );

	const result = await batchFetch( [ 'http://foo.com', 'http://bar.com' ] );
	expect( fetch ).toHaveBeenCalledTimes( 2 );
	expect( result ).toHaveLength( 2 );
} );

test( 'batchFetcher throws a FetchError on fail', async () => {
	const responsePromise = Promise.resolve(
		{
			json: async () => { return { foo: 'bar' }; },
			ok: false
		}
	);

	fetch.mockReturnValue( responsePromise );
	try {
		await batchFetch( [ 'http://fee.com', 'http://baz.com' ] );
	} catch ( e ) {
		expect( e ).toBeInstanceOf( FetchError );
	}

} );
