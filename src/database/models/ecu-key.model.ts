import { Model, Optional } from 'sequelize';
import { SequelizeSingleton } from '../server';
import { FieldFactory, JSONSerializer } from '../utils';

interface ECUKeyAttributes {
	id: string;
	ecuId: string;
	publicKey: string;
	privateKey: string;
}
export interface ECUKeyInput extends Optional<ECUKeyAttributes, 'id'> {}

export class ECUKey extends Model<ECUKeyAttributes, ECUKeyInput> implements ECUKeyAttributes {
	declare id: string;
	declare ecuId: string;
	declare publicKey: string;
	declare privateKey: string;

	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<ECUKeyAttributes>();
}

ECUKey.init(
	{
		id: FieldFactory.UUId().Build(),
		ecuId: FieldFactory.String().NotNull().References({ model: 'ecus', key: 'id' }).Build(),
		publicKey: FieldFactory.Text().NotNull().Build(),
		privateKey: FieldFactory.Text().NotNull().Build(),
	},
	{
		...FieldFactory.BasicModelConfig({
			sequelize: SequelizeSingleton.getInstance().connectionDetails,
			tableName: 'ecu_keys',
			timestamps: true,
		}),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
