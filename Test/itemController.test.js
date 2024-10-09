const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const itemController = require('../controllers/itemController');
const Item = require('../models/Item'); 

// Mock response object
const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('Item Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = mockRes();
    });

    afterEach(() => {
        sinon.restore(); // Resets all stubs, mocks, and spies between tests
    });

    describe('createItem', () => {
        it('should create an item and return status 201', async () => {
            const mockItem = { id: 1, name: 'Test Item' };
            sinon.stub(Item, 'createItem').resolves(mockItem);

            req.body = { name: 'Test Item' };

            await itemController.createItem(req, res);

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith(mockItem);
        });

        it('should return 500 if there is an error', async () => {
            const error = new Error('Something went wrong');
            sinon.stub(Item, 'createItem').rejects(error);

            req.body = { name: 'Test Item' };

            await itemController.createItem(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: error.message });
        });
    });

    describe('getItems', () => {
        it('should get all items and return them', async () => {
            const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
            sinon.stub(Item, 'getAllItems').resolves(mockItems);

            await itemController.getItems(req, res);

            expect(res.json).to.have.been.calledWith(mockItems);
        });

        it('should return 500 if there is an error', async () => {
            const error = new Error('Something went wrong');
            sinon.stub(Item, 'getAllItems').rejects(error);

            await itemController.getItems(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: error.message });
        });
    });

    describe('getItemById', () => {
        it('should return the item if found', async () => {
            const mockItem = { id: 1, name: 'Item 1' };
            sinon.stub(Item, 'getItemById').resolves(mockItem);

            req.params.id = 1;

            await itemController.getItemById(req, res);

            expect(res.json).to.have.been.calledWith(mockItem);
        });

        it('should return 404 if item not found', async () => {
            sinon.stub(Item, 'getItemById').resolves(null);

            req.params.id = 1;

            await itemController.getItemById(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Item not found' });
        });

        it('should return 500 if there is an error', async () => {
            const error = new Error('Something went wrong');
            sinon.stub(Item, 'getItemById').rejects(error);

            req.params.id = 1;

            await itemController.getItemById(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: error.message });
        });
    });

    describe('updateItem', () => {
        it('should update the item and return the updated item', async () => {
            const mockItem = { id: 1, name: 'Updated Item' };
            sinon.stub(Item, 'updateItem').resolves(mockItem);

            req.params.id = 1;
            req.body = { name: 'Updated Item' };

            await itemController.updateItem(req, res);

            expect(res.json).to.have.been.calledWith(mockItem);
        });

        it('should return 500 if there is an error', async () => {
            const error = new Error('Something went wrong');
            sinon.stub(Item, 'updateItem').rejects(error);

            req.params.id = 1;
            req.body = { name: 'Updated Item' };

            await itemController.updateItem(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: error.message });
        });
    });

    describe('deleteItem', () => {
        it('should delete the item and return the deleted item', async () => {
            const mockItem = { id: 1, name: 'Deleted Item' };
            sinon.stub(Item, 'deleteItem').resolves(mockItem);

            req.params.id = 1;

            await itemController.deleteItem(req, res);

            expect(res.json).to.have.been.calledWith(mockItem);
        });

        it('should return 500 if there is an error', async () => {
            const error = new Error('Something went wrong');
            sinon.stub(Item, 'deleteItem').rejects(error);

            req.params.id = 1;

            await itemController.deleteItem(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: error.message });
        });
    });
});
