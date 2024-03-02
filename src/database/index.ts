export { Op as DBOperators } from 'sequelize';
export { ProductInput, ProductTranslationInput } from './models';
export * from './repositories';

import { SequelizeSingleton } from './server';
import { TransactionManager } from './utils';

export const transactionManager = new TransactionManager(SequelizeSingleton.getInstance().connectionDetails);
