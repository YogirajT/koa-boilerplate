import * as cors from 'kcors';
// import * as config from 'config';
// import * as Koa from 'koa';
// import { UnauthorizedError } from '../exceptions';

export class Cors {
	constructor() {
		// Empty constructor
	}

	public getCorsOptions(): cors.Options {
		return {
			origin:'*',
			allowMethods: ['GET', 'PUT', 'POST', 'DELETE','OPTIONS'],
			exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
			allowHeaders: [
				'Content-Type',
				'Authorization',
				'Origin',
				'Accept',
				'X-Requested-With',
				'x-access-token',
				'Access-Control-Allow-Origin',
				'servicekey'
			],
			maxAge: 60,
			credentials: true,
			keepHeadersOnError: true
		};
	}
}
