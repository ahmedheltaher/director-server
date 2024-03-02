import * as fs from 'fs/promises';
import { AdminRepository } from '../';
import { loggers } from '../../core';

const seedLogger = loggers.database.child({ module: 'seeder' });

/**
 * Seeds the database with data from a JSON file.
 * @param {string} filePath - The path to the JSON file containing the data to seed the database with.
 * @returns {Promise<void>} - A promise that resolves once the seeding is complete.
 */
export async function seed(filePath: string): Promise<void> {
	const adminRepository = new AdminRepository();

	try {

		// Check if seeding is necessary
		const alreadySeeded = (await adminRepository.findAll()).length > 0;
		if (alreadySeeded) {
			seedLogger.info('The database is already seeded.');
			return;
		}

		// Read data from JSON file
		const data = await fs.readFile(filePath, 'utf8');
		const { books, admins, borrowers } = JSON.parse(data);

		// Seed database with admins, book, and borrower data concurrently
		await Promise.all([
			adminRepository.bulkCreate(admins),
			// bookRepository.bulkCreate(books),
			// borrowerRepository.bulkCreate(borrowers),
		]);

		seedLogger.info('Database successfully seeded.');
	} catch (error) {
		seedLogger.error(`Error seeding the database: ${error}`);
	}
}
