import Fruit from "../entities/FruitEntity";

export interface IDomainEvent {
    dateTimeOccurred: Date;
}

export class FruitCreatedEvent implements IDomainEvent {
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit) {
        this.dateTimeOccurred = new Date();
        this.fruit = fruit;
    }
}

export class FruitUpdatedEvent implements IDomainEvent {
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit) {
        this.dateTimeOccurred = new Date();
        this.fruit = fruit;
    }
}

export class FruitDeletedEvent implements IDomainEvent {
    public dateTimeOccurred: Date;
    public fruitName: string;

    constructor(fruitName: string) {
        this.dateTimeOccurred = new Date();
        this.fruitName = fruitName;
    }
}