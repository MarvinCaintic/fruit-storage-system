import request from "supertest";
import { startServer, stopServer } from "../app";
import {clearDB, } from "./utils/dbHandler";
import FruitFactory from "../domain/factory/fruitFactory";
import { stopCronJob, stopOutboxProcessor} from "../shared/cron/processOutbox";
import fruitService from "../application/services/FruitService";

let app: any;
const fruitFactory = new FruitFactory();

beforeAll(async () => {
    jest.setTimeout(5000);
    app = await startServer();
    await clearDB();
});

afterAll(async () => {
    stopOutboxProcessor(); // Stop outbox processing before shutdown
    stopCronJob(); // Ensure cron job is also stopped
    if (app) {
        await app.close(); // Ensure server shuts down
    }
    await stopServer();
});

afterEach(async () => {
    await clearDB()
});

describe("createFruitForFruitStorage", () => {

    it("should add a new fruit", async () => {
        const mutation = `
          mutation CreateFruitForFruitStorage {
            createFruitForFruitStorage(
                name: "lemon",
                description: "this is a lemon",
                limitOfFruitToBeStored: 10
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                  amount
                }
              }
          }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.createFruitForFruitStorage.fruit.name).toBe("lemon");
        expect(response.body.data.createFruitForFruitStorage.fruit.description).toBe("this is a lemon");
        expect(response.body.data.createFruitForFruitStorage.fruit.limitOfFruitToBeStored).toBe(10);
    });

    it("should fail with long description", async () => {
        const mutation = `
      mutation CreateFruitForFruitStorage {
        createFruitForFruitStorage(
            name: "lemon",
            description: "this is a fruit with a very long description",
            limitOfFruitToBeStored: 10
          ) {
            message
            fruit {
              name
              limitOfFruitToBeStored
              description
              amount
            }
          }
      }
    `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Description cannot exceed 30 characters.");
    });

    describe('should fail with duplicate name',  () => {
        beforeAll(async () => {
            // Ensure a fresh state for each test
            await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
        });

        it('should fail with duplicate name', async () => {
            const mutation = `
              mutation CreateFruitForFruitStorage {
                createFruitForFruitStorage(
                    name: "lemon",
                    description: "this is a lemon",
                    limitOfFruitToBeStored: 10
                  ) {
                    message
                    fruit {
                      name
                      limitOfFruitToBeStored
                      description
                      amount
                    }
                  }
              }
            `;

            const response = await request(app).post("/graphql").send({ query: mutation });
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].message).toBe("A fruit with the name 'lemon' already exists.");
        });
    })
});

describe('deleteFruitFromFruitStorage', () => {
    beforeEach(async () => {
        await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
        await fruitService.storeFruit('lemon', 5);
    });

    it('should fail to delete with existing stock', async () => {
        const mutation = `
          mutation DeleteFruitFromFruitStorage {
              deleteFruitFromFruitStorage(
                name: "lemon"
              )
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Cannot delete fruit with existing storage.");
    });

    it('should delete with force flag', async () => {
        const mutation = `
          mutation DeleteFruitFromFruitStorage {
              deleteFruitFromFruitStorage(
                name: "lemon"
                forceDelete: true
              )
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.data.deleteFruitFromFruitStorage).toBe("Fruit deleted successfully.");
    });
});

describe('removeFruitFromFruitStorage', () => {

    beforeEach(async () => {
        await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
        await fruitService.storeFruit('lemon', 5);
    });

    it('Fruit removed successfully', async () => {
        const mutation = `
          mutation RemoveFruitFromFruitStorage {
              removeFruitFromFruitStorage(
                name: "lemon",
                amount: 5
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                  amount
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.data.removeFruitFromFruitStorage.message).toBe("Fruit removed successfully.");
        expect(response.body.data.removeFruitFromFruitStorage.fruit.amount).toBe(0);
    });

    it('Not enough fruits in storage to remove', async () => {
        const mutation = `
          mutation RemoveFruitFromFruitStorage {
              removeFruitFromFruitStorage(
                name: "lemon",
                amount: 6
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                  amount
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Not enough fruits in storage to remove.");
    });
});

describe('storeFruitToFruitStorage', () => {
    beforeEach(async () => {
        await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
    });

    it('should store fruits within limit', async () => {
        const mutation = `
          mutation StoreFruitToFruitStorage {
              storeFruitToFruitStorage(
                name: "lemon",
                amount: 5
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                  amount
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.data.storeFruitToFruitStorage.fruit.amount).toBe(5);
    });

    it('should fail when exceeding limit', async () => {
        const mutation = `
          mutation StoreFruitToFruitStorage {
              storeFruitToFruitStorage(
                name: "lemon",
                amount: 11
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                  amount
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Storage limit exceeded.");
    });
});

describe('updateFruitForFruitStorage', () => {
    beforeEach(async () => {
        await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
    });

    it('should update description successfully', async () => {
        const mutation = `
          mutation UpdateFruitForFruitStorage {
              updateFruitForFruitStorage(
                name: "lemon",
                description: "updated lemon description.",
                limitOfFruitToBeStored: 30
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.data.updateFruitForFruitStorage.fruit.description).toBe("updated lemon description.");
        expect(response.body.data.updateFruitForFruitStorage.fruit.limitOfFruitToBeStored).toBe(30);
    });

    it('should fail with long description', async () => {
        const mutation = `
          mutation UpdateFruitForFruitStorage {
              updateFruitForFruitStorage(
                name: "lemon",
                description: "updated lemon with a long description",
                limitOfFruitToBeStored: 10
              ) {
                message
                fruit {
                  name
                  limitOfFruitToBeStored
                  description
                }
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query: mutation });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Description cannot exceed 30 characters.");
    });
});

describe('findFruit', () => {
    beforeAll(async () => {
        await fruitFactory.createFruit('lemon', 'this is a lemon', 10);
    });

    it('should return the lemon object and pass', async () => {
        const query = `
          query FindFruit {
              findFruit(name: "lemon") {
                name
                description
                limitOfFruitToBeStored
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query });
        expect(response.body.data.findFruit.name).toBe('lemon');
    });

    it('should return not the lemon object and throw an error', async () => {
        const query = `
          query FindFruit {
              findFruit(name: "not a lemon") {
                name
                description
                limitOfFruitToBeStored
              }
            }
        `;

        const response = await request(app).post("/graphql").send({ query });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe("Fruit not found.");
    });
});