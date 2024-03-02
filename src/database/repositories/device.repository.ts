import { Device, DeviceInput } from '../models';
import { BaseRepository } from './base';

export class DeviceRepository extends BaseRepository<Device, DeviceInput> {
	constructor() {
		super(Device);
	}
}
