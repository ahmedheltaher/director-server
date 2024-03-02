import { CreateOptions, DestroyOptions, FindOptions, Model, ModelStatic, UpdateOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

type CreationAttributes<M extends Model> = MakeNullishOptional<M['_creationAttributes']>;

export class BaseRepository<M extends Model, I extends CreationAttributes<M>> {
	constructor(private model: ModelStatic<M>) {}

	public async findAll(options?: FindOptions<M>): Promise<Array<M>> {
		return this.model.findAll(options);
	}

	public async findOne(options: FindOptions<M>): Promise<M | null> {
		return await this.model.findOne(options);
	}

	public async create(entity: I, options?: CreateOptions<M>): Promise<M> {
		return this.model.create(entity, options);
	}

	public async bulkCreate(entities: Array<I>, options?: CreateOptions<M>): Promise<Array<M>> {
		return this.model.bulkCreate(entities, options);
	}
	public async update(
		entity: Partial<I>,
		options: UpdateOptions<M> = { where: {} }
	): Promise<[affectedCount: number, affectedRows: Array<M>]> {
		return await this.model.update(entity, { ...options, returning: true });
	}

	public async delete(options?: DestroyOptions<M>): Promise<number> {
		return await this.model.destroy(options);
	}
}
