import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

export const AdminDefinitions = {
	AdminLogin: {
		$id: '$AdminLogin',
		type: 'object',
		properties: {
			email: { type: 'string', minLength: 3, maxLength: 100, format: 'email' },
			password: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['email', 'password'],
		additionalProperties: false,
	},
};

export const AdminSchemas = EntitySchema({
	Login: {
		summary: 'Login to access the system functionalities',
		description:
			'This endpoint facilitates the login process for registered Admin. Upon successful login, the system provides an authentication token for accessing the functionalities.',
		tags: ['Admin'],
		body: { $ref: '$AdminLogin' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { token: { type: 'string' } }, errors: ['401'] }),
	},
});
