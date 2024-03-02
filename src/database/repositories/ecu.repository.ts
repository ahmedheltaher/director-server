import { ECU, ECUInput } from '../models';
import { BaseRepository } from './base';

export class ECURepository extends BaseRepository<ECU, ECUInput> {
	constructor() {
		super(ECU);
	}
}
