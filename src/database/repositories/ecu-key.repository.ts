import { ECUKey, ECUKeyInput } from '../models';
import { BaseRepository } from './base';

export class ECUKeyRepository extends BaseRepository<ECUKey, ECUKeyInput> {
	constructor() {
		super(ECUKey);
	}
}
