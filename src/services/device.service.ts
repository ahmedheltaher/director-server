import { DeviceInput, DeviceRepository } from '../database';

export type TDeviceCreate = DeviceInput;
export type TDeviceUpdate = Partial<DeviceInput>;


export class DeviceService {
	constructor(
		private readonly deviceRepository: DeviceRepository,
	) {}

	async add(createData: TDeviceCreate) {
		return await this.deviceRepository.create(createData);
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


