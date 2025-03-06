import Fruit from "../entities/FruitEntity";
import crypto from "crypto";

export interface IDomainEvent {
    id?: string; // Optional event ID for tracking
    dateTimeOccurred: Date;
    toJSON(): object;  // Serialization for storing in outbox
}

export class FruitCreatedEvent implements IDomainEvent {
    public id?: string;
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit, id?: string) {
        this.id = id || crypto.randomUUID();  // Unique ID for the event
        this.dateTimeOccurred = new Date();
        this.fruit = fruit;
    }

    toJSON() {
        return {
            id: this.id,
            eventType: "FruitCreated",
            dateTimeOccurred: this.dateTimeOccurred,
            fruit: {
                name: this.fruit.getName(),
                description: this.fruit.getDescription(),
                limitOfFruitToBeStored: this.fruit.getLimit(),
                amount: this.fruit.getAmount(),
            },
        };
    }
}

export class FruitUpdatedEvent implements IDomainEvent {
    public id?: string;
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit, id?: string) {
        this.id = id || crypto.randomUUID();
        this.dateTimeOccurred = new Date();
        this.fruit = fruit;
    }

    toJSON() {
        return {
            id: this.id,
            eventType: "FruitUpdated",
            dateTimeOccurred: this.dateTimeOccurred,
            fruit: {
                name: this.fruit.getName(),
                description: this.fruit.getDescription(),
                limitOfFruitToBeStored: this.fruit.getLimit(),
                amount: this.fruit.getAmount(),
            },
        };
    }
}

export class FruitDeletedEvent implements IDomainEvent {
    public id?: string;
    public dateTimeOccurred: Date;
    public fruitName: string;

    constructor(fruitName: string, id?: string) {
        this.id = id || crypto.randomUUID();
        this.dateTimeOccurred = new Date();
        this.fruitName = fruitName;
    }

    toJSON() {
        return {
            id: this.id,
            eventType: "FruitDeleted",
            dateTimeOccurred: this.dateTimeOccurred,
            fruitName: this.fruitName,
        };
    }
}
