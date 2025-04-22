import { ProductsController } from './products.controller';
import { vi, Mock } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { Product } from '@prisma/client';

// Mock del Repo
const mockRepo = {
    read: vi.fn().mockResolvedValueOnce([]),
    readById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

describe('ProductsController', () => {
    // Instancia del controlador
    const productsController = new ProductsController(mockRepo);

    // Objeto req
    const req = {
        params: { id: '1' },
        body: {
            id: '1',
            name: 'Phone',
            description: 'A new model of Samsung',
            price: 1000,
            categoryId: 'cat1',
        } as Product,
    } as unknown as Request;

    // Objeto res que simulará el Response de Express
    const res = {
        json: vi.fn(),
        status: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    const error = new Error('Error');

    test('should be defined', () => {
        expect(productsController).toBeDefined();
        expect(productsController).toBeInstanceOf(ProductsController);
    });

    describe('getAll method', () => {
        test('should call json when repo response is valid', async () => {
            // Act
            await productsController.getAll(req, res, next);
            // Assert
            expect(mockRepo.read).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                results: [],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            // Arrange
            (mockRepo.read as Mock).mockRejectedValueOnce(error);
            // Act
            await productsController.getAll(req, res, next);
            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getById method', () => {
        test('should call json when repo response is valid', async () => {
            // Arrange
            (mockRepo.readById as Mock).mockResolvedValueOnce({
                id: '1',
                name: 'Phone',
                description: 'A new model of Samsung',
                price: 1000,
                categoryId: 'cat1',
            });
            // Act
            await productsController.getById(req, res, next);
            // Assert
            expect(mockRepo.readById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [
                    {
                        id: '1',
                        name: 'Phone',
                        description: 'A new model of Samsung',
                        price: 1000,
                        categoryId: 'cat1',
                    },
                ],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            // Arrange
            (mockRepo.readById as Mock).mockRejectedValueOnce(error);
            // Act
            await productsController.getById(req, res, next);
            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    // Create
    describe('create method', () => {
        test('should call json with created product when repo create is successful', async () => {
            // Arrange
            const newProduct: Product = {
                id: '1',
                name: 'Phone',
                description: 'A new model of Samsung',
                price: 1000,
                categoryId: 'cat1',
            };
            (mockRepo.create as Mock).mockResolvedValueOnce(newProduct);
            // Act
            await productsController.create(req, res, next);
            // Assert
            expect(mockRepo.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                results: [newProduct],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            // Arrange
            (mockRepo.create as Mock).mockRejectedValueOnce(error);
            // Act
            await productsController.create(req, res, next);
            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('delete method', () => {
        test('should call json with deleted product when repo delete is successful', async () => {
            // Arrange
            const deletedProduct: Product = {
                id: '1',
                name: 'Phone',
                description: 'A new model of Samsung',
                price: 1000,
                categoryId: 'cat1',
            };
            (mockRepo.delete as Mock).mockResolvedValueOnce(deletedProduct);

            // Act
            await productsController.delete(req, res, next);

            // Assert
            expect(mockRepo.delete).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [deletedProduct],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            // Arrange
            (mockRepo.delete as Mock).mockRejectedValueOnce(error);

            // Act
            await productsController.delete(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('delete method', () => {
        test('should call json with deleted product when repo delete is successful', async () => {
            // Arrange
            const deletedProduct: Product = {
                id: '1',
                name: 'Phone',
                description: 'A new model of Samsung',
                price: 1000,
                categoryId: 'cat1',
            };
            (mockRepo.delete as Mock).mockResolvedValueOnce(deletedProduct);

            // Act
            await productsController.delete(req, res, next);

            // Assert
            expect(mockRepo.delete).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [deletedProduct],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            // Arrange
            (mockRepo.delete as Mock).mockRejectedValueOnce(error);

            // Act
            await productsController.delete(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
