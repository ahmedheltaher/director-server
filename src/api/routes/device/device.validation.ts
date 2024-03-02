import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

const DeviceProperties = {
	name: { type: 'string', minLength: 3, maxLength: 100 },
};

export const DevicesDefinitions = {
	Device: {
		$id: '$Device',
		type: 'object',
		properties: { id: { type: 'string', format: 'uuid' }, ...DeviceProperties },
		additionalProperties: false,
	},
	DeviceCreate: {
		$id: '$DeviceCreate',
		type: 'object',
		properties: DeviceProperties,
		required: ['name'],
		additionalProperties: false,
	},
	DeviceUpdate: {
		$id: '$DeviceUpdate',
		type: 'object',
		properties: DeviceProperties,
		additionalProperties: false,
	},
	DeviceIdInput: {
		$id: '$DeviceIdInput',
		type: 'object',
		properties: { deviceId: { type: 'string', format: 'uuid' } },
		required: ['deviceId'],
		additionalProperties: false,
	},
	ECUIdInput: {
		$id: '$ECUIdInput',
		type: 'object',
		properties: { ecuId: { type: 'string', format: 'uuid' } },
		required: ['ecuId'],
		additionalProperties: false,
	},
	ECU: {
		$id: '$ECU',
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			deviceId: { type: 'string', format: 'uuid' },
			isPrimary: { type: 'boolean' },
			name: { type: 'string', minLength: 3, maxLength: 100 },
			hardwareIdentifier: { type: 'string', minLength: 3, maxLength: 100 },
			serialNumber: { type: 'string', minLength: 3, maxLength: 100 },
		},
		required: ['id', 'deviceId', 'isPrimary', 'name', 'hardwareIdentifier', 'serialNumber'],
		additionalProperties: false,
	},
	ECUCreate: {
		$id: '$ECUCreate',
		type: 'object',
		properties: {
			isPrimary: { type: 'boolean' },
			name: { type: 'string', minLength: 3, maxLength: 100 },
			hardwareIdentifier: { type: 'string', minLength: 3, maxLength: 100 },
			serialNumber: { type: 'string', minLength: 3, maxLength: 100 },
		},
		required: ['isPrimary', 'name', 'hardwareIdentifier', 'serialNumber'],
		additionalProperties: false,
	},
	ECUUpdate: {
		$id: '$ECUUpdate',
		type: 'object',
		properties: {
			isPrimary: { type: 'boolean' },
			name: { type: 'string', minLength: 3, maxLength: 100 },
			hardwareIdentifier: { type: 'string', minLength: 3, maxLength: 100 },
			serialNumber: { type: 'string', minLength: 3, maxLength: 100 },
		},
		additionalProperties: false,
	},
};

export const DeviceSchemas = EntitySchema({
	GetAllDevices: {
		summary: 'Retrieve all devices with optional pagination',
		description:
			'This endpoint retrieves a list of all devices available in the system. Pagination support is provided for managing large collections of devices.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Device'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { devices: { type: 'array', items: { $ref: '$Device' } } },
			errors: ['401'],
		}),
	},
	GetDevice: {
		summary: 'Retrieve device details by ID',
		description:
			'This endpoint retrieves detailed information about a specific device in the system based on its unique identifier.',
		params: { $ref: '$DeviceIdInput' },
		tags: ['Device'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { device: { $ref: '$Device' } }, errors: ['401'] }),
	},
	AddECU: {
		summary: 'Add an ECU to a device',
		description:
			'This endpoint adds a new ECU to a device. The ECU is identified by a unique identifier and is associated with a specific device.',
		tags: ['Device'],
		params: { $ref: '$DeviceIdInput' },
		body: { $ref: '$ECUCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { ecu: { $ref: '$ECU' } }, errors: ['401'] }),
	},
	DeleteECU: {
		summary: 'Delete an ECU from a device',
		description:
			'This endpoint deletes an ECU from a device. The ECU is identified by a unique identifier and is associated with a specific device.',
		tags: ['Device'],
		params: {
			type: 'object',
			properties: {
				...DevicesDefinitions.ECUIdInput.properties,
				...DevicesDefinitions.DeviceIdInput.properties,
			},
			required: ['deviceId', 'ecuId'],
			additionalProperties: false,
		},
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
	UpdateECU: {
		summary: 'Update an ECU in a device',
		description:
			'This endpoint updates the details of an ECU in a device. The ECU is identified by a unique identifier and is associated with a specific device.',
		tags: ['Device'],
		params: {
			type: 'object',
			properties: {
				...DevicesDefinitions.ECUIdInput.properties,
				...DevicesDefinitions.DeviceIdInput.properties,
			},
			required: ['deviceId', 'ecuId'],
			additionalProperties: false,
		},
		body: { $ref: '$ECUUpdate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { ecu: { $ref: '$ECU' } }, errors: ['401'] }),
	},
	GetECU: {
		summary: 'Retrieve ECU details by ID',
		description:
			'This endpoint retrieves detailed information about a specific ECU in the system based on its unique identifier.',
		tags: ['Device'],
		params: {
			type: 'object',
			properties: {
				...DevicesDefinitions.ECUIdInput.properties,
				...DevicesDefinitions.DeviceIdInput.properties,
			},
			required: ['deviceId', 'ecuId'],
			additionalProperties: false,
		},
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { ecu: { $ref: '$ECU' } }, errors: ['401'] }),
	},
	GetDeviceECUs: {
		summary: 'Retrieve all ECU details for a device',
		description:
			'This endpoint retrieves a list of all ECU details for a specific device in the system based on its unique identifier.',
		tags: ['Device'],
		params: { $ref: '$DeviceIdInput' },
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { ecus: { type: 'array', items: { $ref: '$ECU' } } },
			errors: ['401'],
		}),
	},
	AddDevice: {
		summary: 'Add a new device to the system.',
		description: 'this endpoint adds a new device to the system.',
		tags: ['Device'],
		body: { $ref: '$DeviceCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { device: { $ref: '$Device' } }, errors: ['401'] }),
	},
	UpdateDevice: {
		summary: 'Update device details by ID',
		description:
			'This endpoint updates the details of a specific device in the system based on its unique identifier.',
		tags: ['Device'],
		params: { $ref: '$DeviceIdInput' },
		body: { $ref: '$DeviceUpdate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { device: { $ref: '$Device' } }, errors: ['401'] }),
	},
	DeleteDevice: {
		summary: 'Delete a device by ID',
		description: 'This endpoint deletes a specific device in the system based on its unique identifier.',
		params: { $ref: '$DeviceIdInput' },
		tags: ['Device'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
});
