import { configurations } from '../core';
import { AdminRepository } from '../database';
import { JWTService } from '../utils';

export type TAdminLoginInput = { email: string; password: string };

export class AdminService {
	constructor(private readonly adminRepository: AdminRepository) {}

	async login({ email, password }: TAdminLoginInput) {
		const admin = await this.adminRepository.findOne({ where: { email } });
		if (!admin) return { status: false };
		if (!admin.comparePassword(password)) return { status: false };
		const token = JWTService.generateToken(
			{ UID: admin.dataValues.id, t: '0x00' },
			configurations.jwt.secret,
			configurations.jwt.tokenDuration.short
		);
		return { status: true, token };
	}

	async getById(id: string) {
		return await this.adminRepository.findOne({ where: { id } });
	}
}
