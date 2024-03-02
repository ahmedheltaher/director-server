import { TLibrarianLoginInput } from '../../../services';
import { AdminSchemas } from './admin.validation';

export async function AdminApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { adminService } = services;
	return [
		{
			url: '/login',
			method: 'POST',
			schema: AdminSchemas.Login,
			config: { rateLimit: { limit: 5, interval: 60 } },
			handler: async ({ body }: HandlerParameter<{ body: TLibrarianLoginInput }>) => {
				const { status, token } = await adminService.login(body);
				if (!status) {
					return {
						status: false,
						error: { type: 'UNAUTHENTICATED', details: { message: 'Invalid email or password' } },
					};
				}
				return { status: true, data: { token } };
			},
		},
	];
}
