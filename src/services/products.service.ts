import {
	BoycottedProductRepository,
	ProductInput,
	ProductRepository,
	ProductTranslationInput,
	SupportedProductRepository,
	TLanguage,
} from '../database';

export type TProductCreate = { createData: ProductInput; translationData: Record<TLanguage, ProductTranslationInput> };
export type TProductUpdate = Partial<ProductInput>;

export class ProductService {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly boycottedProductRepository: BoycottedProductRepository,
		private readonly supportedProductRepository: SupportedProductRepository
	) {}

	async add({ createData, translationData }: TProductCreate) {
		return await this.productRepository.create({ entity: createData, translationEntities: translationData });
	}

	async getAll({ limit, offset }: PaginatedServiceMethod = { limit: -1, offset: 0 }) {
		const options: Record<string, any> = {};
		if (offset) options.offset = offset;
		if (limit && limit > -1) options.limit = limit;

		return await this.productRepository.findAll(options);
	}

	async getById(id: string) {
		return await this.productRepository.findOne({ where: { id } });
	}

	// async getByISBN(ISBN: string) {
	// 	return await this.ProductRepository.findOne({ where: { ISBN } });
	// }

	// async getByTitle(title: string) {
	// 	return await this.ProductRepository.findAll({
	// 		where: { title: { [DBOperators.like]: `%${title}%` } },
	// 	});
	// }

	// async getByAuthor(author: string) {
	// 	return await this.ProductRepository.findAll({
	// 		where: { author: { [DBOperators.like]: `%${author}%` } },
	// 	});
	// }

	// async update(id: string, updateData: TProductUpdate) {
	// 	return await this.ProductRepository.update({
	// 	updateData	entity
	// 	},
	// 		, { where: { id } });
	// }

	async delete(id: string): Promise<boolean> {
		const result = await this.productRepository.delete(id);
		return !!result;
	}
}
