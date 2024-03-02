import bcrypt from 'bcrypt';
import { Model, Optional } from 'sequelize';
import { configurations } from '../../core';
import { SequelizeSingleton } from '../server';
import { FieldFactory, IDates, JSONSerializer } from '../utils';

interface AdminAttributes {
	id: string;
	name: string;
	password: string;
	email: string;
	isSuperAdmin: boolean;
}
export interface AdminInput
	extends Optional<AdminAttributes, 'id'>,
		Optional<IDates, 'createdAt' | 'deletedAt' | 'updatedAt'> {}

export class Admin extends Model<AdminAttributes, AdminInput> implements AdminAttributes {
	declare id: string;
	declare name: string;
	declare password: string;
	declare email: string;
	declare isSuperAdmin: boolean;

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.dataValues.password);
	}

	toJSON() {
		return this.jsonSerializer.toJSON({ modelInstance: this.dataValues, keysToDelete: ['createdAt', 'updatedAt'] });
	}

	private jsonSerializer = new JSONSerializer<AdminAttributes>();
}

Admin.init(
	{
		id: FieldFactory.UUId().Build(),
		name: FieldFactory.String().NotNull().Build(),
		email: FieldFactory.String().NotNull().Unique().Build(),
		password: {
			...FieldFactory.String().NotNull().Build(),
			set(rowPassword: string): void {
				this.setDataValue('password', bcrypt.hashSync(rowPassword, configurations.bcrypt.saltOrRounds));
			},
		},
		isSuperAdmin: FieldFactory.Boolean().DefaultValue(false).Build(),
	},
	{
		...FieldFactory.BasicModelConfig({
			sequelize: SequelizeSingleton.getInstance().connectionDetails,
			tableName: 'admins',
			timestamps: true,
		}),
		indexes: [{ unique: true, fields: [{ name: 'id' }] }],
	}
);
