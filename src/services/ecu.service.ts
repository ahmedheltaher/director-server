import { ECUKeyRepository, ECURepository } from '../database';
import { ECUInput } from '../database/models';
import { KeyPairGenerator } from '../utils';

export type TAddECU = ECUInput;
export type TUpdateECU = Partial<ECUInput>;

export class ECUService {
	constructor(
		private readonly ecuRepository: ECURepository,
		private readonly ecuKeyRepository: ECUKeyRepository
	) {}

	async add(createData: TAddECU) {
		return await this.ecuRepository.create(createData);
	}

	async delete(deviceId: string, id: string): Promise<boolean> {
		const result = await this.ecuRepository.delete({ where: { id, deviceId } });
		return !!result;
	}

	async getById(id: string) {
		return await this.ecuRepository.findOne({ where: { id } });
	}

	async update(deviceId: string, id: string, updateData: TUpdateECU) {
		return await this.ecuRepository.update(updateData, { where: { id, deviceId } });
	}

	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.ecuRepository.findAll(options);
	}

	async getEcus(deviceId: string) {
		return await this.ecuRepository.findAll({ where: { deviceId } });
	}

	async getEcu(deviceId: string, ecuId: string) {
		return await this.ecuRepository.findOne({ where: { id: ecuId, deviceId } });
	}

	async generateKey(deviceId: string, ecuId: string) {
		const ecu = await this.ecuRepository.findOne({ where: { id: ecuId, deviceId } });
		if (!ecu) return { status: false };
		const { privateKey, publicKey } = KeyPairGenerator.generateKeyPair();
		const ecuKey = await this.ecuKeyRepository.create({
			ecuId,
			privateKey,
			publicKey,
		});
		return { status: true };
	}

	async revokeKey(deviceId: string, ecuId: string) {
		const ecu = await this.ecuRepository.findOne({ where: { id: ecuId, deviceId } });
		if (!ecu) return { status: false };
		const ecuKey = await this.ecuKeyRepository.findOne({ where: { ecuId } });
		console.log("󱓞 ~ ECUService ~ revokeKey ~ ecuKey:", ecuKey)
		if (!ecuKey) return { status: false };
		await this.ecuKeyRepository.delete({ where: { ecuId } });
		return { status: true };
	}
}
