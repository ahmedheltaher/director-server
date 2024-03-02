import { AdminRepository, DeviceRepository, ECURepository } from '../database';
import { AdminService } from './admin.service';
import { DeviceService } from './device.service';

export async function GetServices() {
	const adminService = new AdminService(new AdminRepository());
	const deviceService = new DeviceService(new DeviceRepository(), new ECURepository());

	return { adminService, deviceService } as const;
}

export { TAdminLoginInput as TLibrarianLoginInput } from './admin.service';
export { TAddECU, TDeviceCreate, TDeviceUpdate, TUpdateECU } from './device.service';

