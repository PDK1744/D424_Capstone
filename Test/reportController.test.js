const { expect } = require('chai');
const sinon = require('sinon');
const { getItemsInStockByCategory, getItemsLowOnStock } = require('../controllers/reportController');
const pool = require('../config/db').pool;
const originalConsoleError = console.error;

describe('reportController', () => {
    before(() => {
        console.error = () => {}; // Suppress console.error
    });

    after(() => {
        console.error = originalConsoleError; // Restore console.error after tests
    });

    afterEach(() => {
        sinon.restore(); // Restore the default sandbox after each test
    });

    describe('getItemsInStockByCategory', () => {
        it('should return total items in stock by category', async () => {
            const req = {};
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            const mockData = [{ category: 'Electronics', totalStock: 50 }, { category: 'Clothing', totalStock: 30 }];
            const queryStub = sinon.stub(pool, 'query').resolves({ rows: mockData });

            await getItemsInStockByCategory(req, res);

            expect(queryStub.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(mockData)).to.be.true;
        });

        it('should handle errors gracefully', async () => {
            const req = {};
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            const errorMessage = 'Database error';
            sinon.stub(pool, 'query').rejects(new Error(errorMessage));

            await getItemsInStockByCategory(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ error: 'Failed to generate report' })).to.be.true;
        });
    });

    describe('getItemsLowOnStock', () => {
        it('should return items low on stock', async () => {
            const req = { body: { threshold: 10 } };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            const mockData = [{ id: 1, name: 'Item1', numberInStock: 5 }, { id: 2, name: 'Item2', numberInStock: 8 }];
            const queryStub = sinon.stub(pool, 'query').resolves({ rows: mockData });

            await getItemsLowOnStock(req, res);

            expect(queryStub.calledOnce).to.be.true;
            expect(queryStub.calledWith(`SELECT * FROM items WHERE numberInStock <= $1`, [10])).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(mockData)).to.be.true;
        });

        it('should handle errors gracefully', async () => {
            const req = { body: { threshold: 10 } };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };

            const errorMessage = 'Database error';
            sinon.stub(pool, 'query').rejects(new Error(errorMessage));

            await getItemsLowOnStock(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ error: 'Failed to generate report' })).to.be.true;
        });
    });
});
