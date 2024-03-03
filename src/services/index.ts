import { AdminRepository, DeviceRepository, ECUKeyRepository, ECURepository } from '../database';
import { AdminService } from './admin.service';
import { DeviceService } from './device.service';
import { ECUService } from './ecu.service';

export async function GetServices() {
	const adminService = new AdminService(new AdminRepository());
	const deviceService = new DeviceService(new DeviceRepository());
	const ecuService = new ECUService(new ECURepository(), new ECUKeyRepository());

	return { adminService, deviceService, ecuService } as const;
}

export { TAdminLoginInput as TLibrarianLoginInput } from './admin.service';
export { TDeviceCreate, TDeviceUpdate } from './device.service';
export { TAddECU, TUpdateECU } from './ecu.service';

