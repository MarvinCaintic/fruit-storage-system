import fruitRepository  from "../infrastructure/repositories/FruitRepository";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fruitFactory from "../domain/factory/fruitFactory";

describe('Fruit Storage System', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        // Start an in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Connect Mongoose to the in-memory server
        await mongoose.connect(uri, {
            // Additional options if needed
        });
        console.log('Connected to in-memory MongoDB');
    });

    afterAll(async () => {
        // Disconnect and stop the in-memory MongoDB server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('createFruitForFruitStorage', () => {

        beforeEach(async () => {
            const collections = mongoose.connection.collections;
            for (const key in collections) {
                await collections[key].deleteMany({});
            }
        });

        it('should create a fruit successfully', async () => {
            const fruit = fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            const savedFruit = await fruitRepository.save(fruit);
            expect(savedFruit.name).toBe('lemon');
        });

        it('should fail with long description', async () => {
            const fruit = await fruitFactory.createFruit(
                'lemon',
                'this is a fruit with a very long description',
                10
            );
            await expect(fruitRepository.save(fruit)).rejects.toThrow('Description cannot exceed 30 characters.');
        });
    });

    describe('continue',  () => {
        beforeAll(async () => {
            const collections = mongoose.connection.collections;
            for (const key in collections) {
                await collections[key].deleteMany({});
            }
            // Ensure a fresh state for each test
            const fruit = await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            await fruitRepository.save(fruit);
        });

        it('should fail with duplicate name', async () => {
            const fruit = fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            await expect(fruitRepository.save(fruit)).rejects.toThrow("A fruit with the name 'lemon' already exists.");
        });
    })

    describe('updateFruitForFruitStorage', () => {
        // beforeAll(async () => {
            // Ensure a fresh state for each test
            // const fruit = await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            // await fruitRepository.save(fruit);
        // });

        it('should update description successfully', async () => {
            const updatedFruit = await fruitRepository.updateFruit(
                'lemon',
                'updated lemon description',
                10
            );
            expect(updatedFruit).not.toBeNull();
            // Now that we know it's not null, we can safely access its properties.
            expect(updatedFruit!.description).toBe('updated lemon description');
        });

        it('should fail with long description', async () => {
            await expect(
                fruitRepository.updateFruit(
                    'lemon',
                    'updated lemon with a long description',
                    10
                )
            ).rejects.toThrow("Description cannot exceed 30 characters.");
        });
    });

    describe('deleteFruitFromFruitStorage', () => {
        beforeAll(async () => {
            // const fruit = await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            // await fruitRepository.save(fruit);
            await fruitRepository.storeFruit('lemon', 5);
        });

        it('should fail to delete with existing stock', async () => {
            await expect(fruitRepository.delete('lemon')).rejects.toThrow('Cannot delete fruit with existing storage.');
        });

        it('should delete with force flag', async () => {
            const result = await fruitRepository.delete('lemon', true);
            expect(result).toBeUndefined();
        });
    });

    describe('storeFruitToFruitStorage', () => {
        beforeAll(async () => {
            const fruit = await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
            await fruitRepository.save(fruit);
        });

        it('should store fruits within limit', async () => {
            const result = await fruitRepository.storeFruit('lemon', 5);
            expect(result!.amount).toBe(5);
        });

        it('should fail when exceeding limit', async () => {
            await expect(fruitRepository.storeFruit('lemon', 11)).rejects.toThrow('Storage limit exceeded.');
        });
    });

    describe('removeFruitFromFruitStorage', () => {
        // beforeAll(async () => {
        //     const fruit = await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
        //     await fruitRepository.save(fruit);
        //     await fruitRepository.storeFruit('lemon', 5);
        // });

        it('should remove exact amount', async () => {
            const result = await fruitRepository.removeFruit('lemon', 5);
            expect(result!.amount).toBe(0);
        });

        it('should fail when removing more than available', async () => {
            await expect(fruitRepository.removeFruit('lemon', 6)).rejects.toThrow('Not enough fruits in storage to remove.');
        });
    });
});
