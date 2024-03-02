import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse } from '../../core/utils';
import { JWTService } from '../../utils';

export async function AdminsOnlyBuilder({ configurations, services }: HookBuilderInput) {
	return async (request: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
		const token = request.headers.authentication;
		const { code, body } = GenerateResponse({
			responseInput: { status: false, error: { type: 'UNAUTHENTICATED' } },
		});

		if (!token || typeof token !== 'string') {
			return reply.code(code).send(body);
		}

		try {
			const payload = JWTService.decodeToken(token, configurations.jwt.secret);
			const { UID } = payload as any;
			const admin = await services.adminService.getById(UID);
			if (!admin) return reply.code(code).send(body);

			reply.locals = { ...reply.locals, ...payload };
		} catch (error) {
			return reply.code(code).send(body);
		}
	};
}
