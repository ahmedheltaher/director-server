import { Model, Optional } from 'sequelize';
import { SequelizeSingleton } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface DeviceAttributes {
	id: string;
	namespace: string;
	primaryECUId: string;
}
export interface LibrarianInput
	extends Optional<DeviceAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Device extends Model<DeviceAttributes, LibrarianInput> implements DeviceAttributes {
	declare id: string;
	declare namespace: string;
	declare primaryECUId: string;



	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<DeviceAttributes>();
}

Device.init(
	{
		id: FieldFactory.UUId().Build(),
		namespace: FieldFactory.String().NotNull().Build(),
		primaryECUId: FieldFactory.String().NotNull().Unique().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({
			sequelize: SequelizeSingleton.getInstance().connectionDetails,
			tableName: 'devices',
			timestamps: true,
		}),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
// TODO: Add ref Reference