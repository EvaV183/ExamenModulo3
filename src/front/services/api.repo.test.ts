import { ApiRepo } from './api.repo';
import { vi } from 'vitest';

// Mock de la función global fetch
global.fetch = vi.fn();

describe('ApiRepo', () => {
    let apiRepo: ApiRepo;

    beforeEach(() => {
        apiRepo = new ApiRepo();
    });

    afterEach(() => {
        vi.clearAllMocks(); // Para limpiar los mocks de cada test
    });

    test('should fetch products', async () => {
        const mockProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];

        (fetch as vi.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts,
        });

        const products = await apiRepo.getProducts();

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/products');
        expect(products).toEqual(mockProducts);
    });

    test('should throw an error when fetching products fails', async () => {
        (fetch as vi.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ message: 'Not Found' }),
        });

        await expect(apiRepo.getProducts()).rejects.toThrow('404 Not Found');
    });

    test('should create a product', async () => {
        const newProduct = { name: 'New Product', price: 100 };
        const createdProduct = { ...newProduct, id: 1 };

        (fetch as vi.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => createdProduct,
        });

        const result = await apiRepo.createProduct(newProduct);

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/products',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(newProduct),
            }),
        );

        expect(result).toEqual(createdProduct);
    });
});
