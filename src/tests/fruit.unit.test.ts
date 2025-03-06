import { clearDB, closeDB, connectDB } from "./utils/dbHandler";
import FruitFactory from "../domain/factory/fruitFactory";
import fruitService from "../application/services/FruitService";

const fruitFactory = new FruitFactory();

describe("Fruit Storage System Unit Testing", () => {
    beforeAll(async () => {
        await connectDB(); // Start the in-memory database
    });

    afterAll(async () => {
        await closeDB(); // Stop the database after all tests
    });

    afterEach(async () => {
        await clearDB();
    });

    describe("Create Fruit", () => {
        it("should create a fruit successfully", async () => {
            const savedFruit = await fruitFactory.createFruit("lemon", "this is a lemon", 10);
            expect(savedFruit.getName()).toBe("lemon");
        });

        it("should fail with long description", async () => {
            await expect(
                fruitService.createFruit("lemon", "this is a fruit with a very long description", 10)
            ).rejects.toThrowError("Description cannot exceed 30 characters.");
        });

        describe("Duplicate Name Handling", () => {
            beforeEach(async () => {
                await fruitFactory.createFruit("lemon", "this is a lemon", 10);
            });

            it("should fail when creating a fruit with a duplicate name", async () => {
                await expect(
                    fruitFactory.createFruit("lemon", "this is a lemon", 10)
                ).rejects.toThrow("A fruit with the name 'lemon' already exists.");
            });
        });
    });

    describe("Delete Fruit", () => {
        beforeEach(async () => {
            await fruitFactory.createFruit("lemon", "this is a lemon", 10);
            await fruitService.storeFruit("lemon", 5);
        });

        it("should fail to delete with existing stock", async () => {
            await expect(fruitService.deleteFruit("lemon")).rejects.toThrow("Cannot delete fruit with existing storage.");
        });

        it("should delete with force flag", async () => {
            await expect(fruitService.deleteFruit("lemon", true)).resolves.toBeUndefined();
        });
    });

    describe("Remove Fruit", () => {
        beforeEach(async () => {
            await fruitFactory.createFruit("lemon", "this is a lemon", 10);
            await fruitService.storeFruit("lemon", 5);
        });

        afterEach(async () => await clearDB());

        it("should remove exact amount", async () => {
            const result = await fruitService.removeFruit("lemon", 5);
            expect(result!.getAmount()).toBe(0);
        });

        it("should fail when removing more than available", async () => {
            await expect(fruitService.removeFruit("lemon", 6)).rejects.toThrow("Not enough fruits in storage to remove.");
        });
    });

    describe("Store Fruit", () => {
        beforeEach(async () => {
            await fruitFactory.createFruit("lemon", "this is a lemon", 10);
        });

        afterEach(async () => await clearDB());

        it("should store fruits within limit", async () => {
            const result = await fruitService.storeFruit("lemon", 5);
            expect(result!.getAmount()).toBe(5);
        });

        it("should fail when exceeding limit", async () => {
            await expect(fruitService.storeFruit("lemon", 11)).rejects.toThrow("Storage limit exceeded.");
        });
    });

    describe("Update Fruit", () => {
        beforeEach(async () => {
            await fruitFactory.createFruit("lemon", "this is a lemon", 10);
        });

        it("should update description successfully", async () => {
            const updatedFruit = await fruitService.updateFruit("lemon", "updated lemon description", 10);
            expect(updatedFruit!.getDescription()).toBe("updated lemon description");
        });

        it("should fail with long description", async () => {
            await expect(
                fruitService.updateFruit("lemon", "updated lemon with a long description", 10)
            ).rejects.toThrow("Description cannot exceed 30 characters.");
        });
    });

    describe('findFruit', () => {
        beforeAll(async () => {
            await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
        });

        it('should return the lemon object and pass', async () => {
            const fruit = await fruitService.findFruit( 'lemon' );
            expect(fruit).not.toBeNull();
            expect(fruit!.getName()).toBe('lemon');
        });

        it('should return not the lemon object and throw an error', async () => {
            await expect(
                fruitService.findFruit( 'not a lemon' )
            ).rejects.toThrow("Fruit not found.");
        });
    });
});
