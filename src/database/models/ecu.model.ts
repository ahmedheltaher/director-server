import { Model, Optional } from 'sequelize';
import { SequelizeSingleton } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface ECUAttributes {
	id: string;
	name: string;
	deviceId: string;
	isPrimary: boolean;
	serialNumber: string;
	hardwareIdentifier: string;
	firmwareVersion: string;
}
export interface ECUInput
	extends Optional<ECUAttributes, 'id' | 'firmwareVersion'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class ECU extends Model<ECUAttributes, ECUInput> implements ECUAttributes {
	declare id: string;
	declare name: string;
	declare deviceId: string;
	declare isPrimary: boolean;
	declare serialNumber: string;
	declare hardwareIdentifier: string;
	declare firmwareVersion: string;

	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<ECUAttributes>();
}

ECU.init(
	{
		id: FieldFactory.UUId().Build(),
		name: FieldFactory.String().NotNull().Build(),
		deviceId: FieldFactory.String().NotNull().References({ model: 'devices', key: 'id' }).Build(),
		isPrimary: FieldFactory.Boolean().DefaultValue(false).Build(),
		serialNumber: FieldFactory.String().NotNull().Unique().Build(),
		hardwareIdentifier: FieldFactory.String().NotNull().Unique().Build(),
		firmwareVersion: FieldFactory.String().Nullable().Build(), // TODO: Add Ref to firmware version
	},
	{
		...FieldFactory.BasicModelConfig({
			sequelize: SequelizeSingleton.getInstance().connectionDetails,
			tableName: 'ecus',
			timestamps: true,
		}),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
