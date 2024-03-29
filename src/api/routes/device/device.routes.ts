import { TAddECU, TDeviceCreate, TDeviceUpdate, TUpdateECU } from '../../../services';

import { DeviceSchemas } from './device.validation';

type TDeviceIDQuery = { deviceId: string };

function PaginatedQuery(query: PaginatedQuery) {
	const { limit = -1, page = 1 } = query;
	const offset = (page - 1) * limit;
	return { limit, offset };
}

async function ECUApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { ecuService } = services;
	return [
		{
			url: '/:deviceId/ecu',
			method: 'POST',
			schema: DeviceSchemas.AddECU,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ body, params }: HandlerParameter<{ body: TAddECU; params: TDeviceIDQuery }>) => {
				const { deviceId } = params;
				const { isPrimary, name, hardwareIdentifier, serialNumber } = body;
				const ecu = await ecuService.add({
					deviceId,
					isPrimary,
					name,
					hardwareIdentifier,
					serialNumber,
				});
				return { status: true, data: { ecu } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId',
			method: 'DELETE',
			schema: DeviceSchemas.DeleteECU,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const result = await ecuService.delete(deviceId, ecuId);
				return { status: true, data: { result } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId',
			method: 'PATCH',
			schema: DeviceSchemas.UpdateECU,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({
				body,
				params,
			}: HandlerParameter<{ body: TUpdateECU; params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const { isPrimary, name, hardwareIdentifier, serialNumber } = body;
				const ecu = await ecuService.update(deviceId, ecuId, {
					isPrimary,
					name,
					hardwareIdentifier,
					serialNumber,
				});
				return { status: true, data: { ecu } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId',
			method: 'GET',
			schema: DeviceSchemas.GetECU,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const ecu = await ecuService.getEcu(deviceId, ecuId);
				return { status: true, data: { ecu } };
			},
		},
		{
			url: '/:deviceId/ecu',
			method: 'GET',
			schema: DeviceSchemas.GetDeviceECUs,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: TDeviceIDQuery }>) => {
				const { deviceId } = params;
				const ecus = await ecuService.getEcus(deviceId);
				return { status: true, data: { ecus } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId/generate-key',
			method: 'POST',
			schema: DeviceSchemas.GenerateECUKey,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const { status } = await ecuService.generateKey(deviceId, ecuId);
				if (!status) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { message: 'Key generated successfully' } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId/revoke-key',
			method: 'POST',
			schema: DeviceSchemas.RevokeECUKey,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const { status } = await ecuService.revokeKey(deviceId, ecuId);
				if (!status) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { message: 'Key revoked successfully' } };
			},
		},
		{
			url: '/:deviceId/ecu/:ecuId/export-key',
			method: 'POST',
			schema: DeviceSchemas.ExportECUKey,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: { deviceId: string; ecuId: string } }>) => {
				const { deviceId, ecuId } = params;
				const { status, data } = await ecuService.exportKey(deviceId, ecuId);
				if (!status) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { key: data?.publicKey } };
			},
		},
	];
}

export async function DeviceApiBuilder(options: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { services } = options;
	const { deviceService } = services;
	const ecuApis = await ECUApiBuilder(options);
	const apis: ApiBuilderOutput = [
		{
			url: '/',
			method: 'GET',
			schema: DeviceSchemas.GetAllDevices,
			// preHandler: [hooks.adminsRequired],
			handler: async ({ query }: HandlerParameter<{ query: PaginatedQuery }>) => {
				const { limit, offset } = PaginatedQuery(query);
				const devices = await deviceService.getAll({ limit, offset });
				return { status: true, data: { devices } };
			},
		},

		{
			url: '/:deviceId',
			method: 'GET',
			schema: DeviceSchemas.GetDevice,
			// preHandler: [hooks.adminsRequired],
			handler: async ({ params }: HandlerParameter<{ params: TDeviceIDQuery }>) => {
				const { deviceId } = params;
				const device = await deviceService.getById(deviceId);
				if (!device) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { device } };
			},
		},
		{
			url: '/',
			method: 'POST',
			schema: DeviceSchemas.AddDevice,
			// preHandler: [ hooks.adminsOnly],
			handler: async ({ body }: HandlerParameter<{ body: TDeviceCreate }>) => {
				try {
					const device = await deviceService.add(body);
					return { status: true, data: { device } };
				} catch (error) {
					return {
						status: false,
						error: {
							type: 'CONFLICT',
							details: {
								message: 'Looks Like there is already a device with the same ISBN',
							},
						},
					};
				}
			},
		},
		{
			url: '/:deviceId',
			method: 'PUT',
			schema: DeviceSchemas.UpdateDevice,
			// preHandler: [hooks.adminsOnly],
			handler: async ({ params, body }: HandlerParameter<{ params: TDeviceIDQuery; body: TDeviceUpdate }>) => {
				const { deviceId } = params;

				const [affectedCount, affectedRows] = await deviceService.update(deviceId, body);
				if (!affectedCount) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { device: affectedRows[0] } };
			},
		},
		{
			url: '/:deviceId',
			method: 'DELETE',
			schema: DeviceSchemas.DeleteDevice,
			// preHandler: [hooks.adminsOnly],
			handler: async ({ params }: HandlerParameter<{ params: TDeviceIDQuery }>) => {
				const { deviceId } = params;
				const isDeleted = await deviceService.delete(deviceId);
				if (!isDeleted) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: {} };
			},
		}
	];

	return [...apis, ...ecuApis];
}
