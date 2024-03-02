import { Admin, LibrarianInput } from '../models';
import { BaseRepository } from './base';

export class AdminRepository extends BaseRepository<Admin, LibrarianInput> {
	constructor() {
		super(Admin);
	}
}
