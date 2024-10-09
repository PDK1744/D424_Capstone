const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const { pool } = require('../config/db'); 
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../models/Item'); 

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Item.js', () => {
    afterEach(() => {
        sinon.restore(); // Restore sinon after each test
    });

    describe('createItem', () => {
        it('should create a new item when valid data is provided', async () => {
            const itemData = {
                name: 'Test Item',
                price: 10.99,
                numberInStock: 100,
                category: 'Test Category',
                sku: 'TEST123',
            };

            // Stub the pool.query method to simulate database interaction
            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: [itemData] }));

            const createdItem = await createItem(itemData);
            expect(createdItem).to.deep.equal(itemData);
        });

        it('should throw an error when validation fails', async () => {
            const invalidItemData = {
                name: 'Te', // Invalid name
                price: -10.99, // Invalid price
                numberInStock: 100,
                category: 'TC',
                sku: 'TE',
            };

            try {
                await createItem(invalidItemData);
                expect.fail('Expected createItem to throw an error');
            } catch (err) {
                console.error('Validation Error:', err);

                
                expect(err.message).to.include('"name" length must be at least 3 characters long');
                expect(err.message).to.include('"price" must be a positive number');
                expect(err.message).to.include('"category" length must be at least 3 characters long');
                expect(err.message).to.include('"sku" length must be at least 3 characters long');
            }
        });
    });

    describe('getAllItems', () => {
        it('should return all items', async () => {
            const mockItems = [
                { name: 'Item 1', price: 10.0, numberInStock: 50, category: 'Category 1', sku: 'SKU1' },
                { name: 'Item 2', price: 15.5, numberInStock: 20, category: 'Category 2', sku: 'SKU2' },
            ];

            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: mockItems }));

            const items = await getAllItems();
            expect(items).to.deep.equal(mockItems);
        });
    });

    describe('getItemById', () => {
        it('should return an item by ID', async () => {
            const mockItem = { name: 'Item 1', price: 10.0, numberInStock: 50, category: 'Category 1', sku: 'SKU1' };
            const itemId = 1;

            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: [mockItem] }));

            const item = await getItemById(itemId);
            expect(item).to.deep.equal(mockItem);
        });

        it('should return undefined when no item is found', async () => {
            const itemId = 999; 

            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: [] }));

            const item = await getItemById(itemId);
            expect(item).to.be.undefined;
        });
    });

    describe('updateItem', () => {
        it('should update an item when valid data is provided', async () => {
            const itemId = 1;
            const updatedData = {
                name: 'Updated Item',
                price: 12.99,
                numberInStock: 200,
                category: 'Updated Category',
                sku: 'UPDATE123',
            };

            const expectedItem = { ...updatedData, id: itemId };
            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: [expectedItem] }));

            const updatedItem = await updateItem(itemId, updatedData);
            expect(updatedItem).to.deep.equal(expectedItem);
        });

        it('should throw an error when validation fails on update', async () => {
            const itemId = 1;
            const invalidItemData = {
                name: 'Up', // Invalid name
                price: -5.00, // Invalid price
                numberInStock: 100,
                category: 'UC',
                sku: 'UP',
            };

            try {
                await updateItem(itemId, invalidItemData);
                
                expect.fail('Expected updateItem to throw an error');
            } catch (err) {
                console.error('Validation Error:', err);

                expect(err.message).to.include('"name" length must be at least 3 characters long');
                expect(err.message).to.include('"price" must be a positive number');
                expect(err.message).to.include('"category" length must be at least 3 characters long');
                expect(err.message).to.include('"sku" length must be at least 3 characters long');
            }
        });
    });

    describe('deleteItem', () => {
        it('should delete an item by ID', async () => {
            const itemId = 1;
            const deletedItem = { id: itemId, name: 'Item 1', price: 10.0, numberInStock: 50, category: 'Category 1', sku: 'SKU1' };

            sinon.stub(pool, 'query').returns(Promise.resolve({ rows: [deletedItem] }));

            const result = await deleteItem(itemId);
            expect(result).to.deep.equal(deletedItem);
        });
    });
});
