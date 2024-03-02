import { Model, Optional } from 'sequelize';
import { SequelizeSingleton } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface DeviceAttributes {
	id: string;
	name: string;
}
export interface DeviceInput
	extends Optional<DeviceAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Device extends Model<DeviceAttributes, DeviceInput> implements DeviceAttributes {
	declare id: string;
	declare name: string;

	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<DeviceAttributes>();
}

Device.init(
	{
		id: FieldFactory.UUId().Build(),
		name: FieldFactory.String().NotNull().Build(),
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
