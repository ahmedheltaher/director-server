import { DeviceInput, DeviceRepository, ECURepository } from '../database';
import { ECUInput } from '../database/models';

export type TDeviceCreate = DeviceInput;
export type TDeviceUpdate = Partial<DeviceInput>;

export type TAddECU = ECUInput;
export type TUpdateECU = Partial<ECUInput>;

// TODO: Create Separate Service for ECU
export class DeviceService {
	constructor(
		private readonly deviceRepository: DeviceRepository,
		private readonly ecuRepository: ECURepository
	) {}

	async add(createData: TDeviceCreate) {
		return await this.deviceRepository.create(createData);
	}

	async addEcu({ deviceId, isPrimary, name, hardwareIdentifier, serialNumber }: TAddECU) {
		return await this.ecuRepository.create({
			deviceId,
			isPrimary,
			name,
			hardwareIdentifier,
			serialNumber,
		});
	}

	async deleteEcu(deviceId: string, ecuId: string) {
		return await this.ecuRepository.delete({ where: { id: ecuId } });
	}

	async getEcus(deviceId: string) {
		return await this.ecuRepository.findAll({ where: { deviceId } });
	}

	async getEcu(deviceId: string, ecuId: string) {
		return await this.ecuRepository.findOne({ where: { id: ecuId, deviceId } });
	}
	async updateEcu(deviceId: string, ecuId: string, updateData: TUpdateECU) {
		return await this.ecuRepository.update(updateData, { where: { id: ecuId, deviceId } });
	}

	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.deviceRepository.findAll(options);
	}

	async getById(id: string) {
		const device = await this.deviceRepository.findOne({ where: { id } });
		if (!device) return null;
		const ecus = await this.ecuRepository.findAll({ where: { deviceId: id } });
		console.log(`ecus: ${JSON.stringify(ecus)}`);
		return device;
	}

	async update(id: string, updateData: TDeviceUpdate) {
		return await this.deviceRepository.update(updateData, { where: { id } });
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.deviceRepository.delete({ where: { id } });
		return !!result;
	}
}
