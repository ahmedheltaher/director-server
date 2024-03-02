import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
	swagger: {
		info: {
			title: '',
			description: 'This API provides endpoints for director server implementation, flowing the Uptane standard.',
			version: '0.1.0',
		},
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [{ name: 'Device', description: 'Endpoints related to managing devices in the system' }],
		securityDefinitions: {
			apiKey: { type: 'apiKey', name: 'authentication', in: 'header' },
		},
	},
};
