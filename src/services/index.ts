import { AdminRepository } from '../database';
import { AdminService } from './admin.service';

export async function GetServices() {
	const adminService = new AdminService(new AdminRepository());

	return {  adminService } as const;
}

export { TAdminLoginInput as TLibrarianLoginInput } from './admin.service';

