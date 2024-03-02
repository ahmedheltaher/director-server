import { AdminApiBuilder, LibrarianDefinitions } from './admin';
import { BookApiBuilder, BooksDefinitions } from './book';
import { BorrowerApiBuilder, BorrowerDefinitions } from './borrower';
import { BorrowingApiBuilder, BorrowingDefinitions } from './borrowing';

export const routes = [
	{ prefix: '/books', buildHandler: BookApiBuilder, version: 'v1' },
	{ prefix: '/borrowers', buildHandler: BorrowerApiBuilder, version: 'v1' },
	{ prefix: '/borrowings', buildHandler: BorrowingApiBuilder, version: 'v1' },
	{ prefix: '/admins', buildHandler: AdminApiBuilder, version: 'v1' },
];

export const ApiDefinitions = {
	...BooksDefinitions,
	...BorrowerDefinitions,
	...BorrowingDefinitions,
	...LibrarianDefinitions,
};
