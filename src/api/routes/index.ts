import { AdminApiBuilder, LibrarianDefinitions } from './admin';
import { DeviceApiBuilder, DevicesDefinitions } from './device';

export const routes = [
	{ prefix: '/device', buildHandler: DeviceApiBuilder, version: 'v1' },
	{ prefix: '/admins', buildHandler: AdminApiBuilder, version: 'v1' },
];

export const ApiDefinitions = {
	...DevicesDefinitions,
	...LibrarianDefinitions,
};
