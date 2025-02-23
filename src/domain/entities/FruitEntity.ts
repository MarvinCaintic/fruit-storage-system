class FruitEntity {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    amount: number;
    createdAt?: Date;

    constructor(
        name: string,
        description: string,
        limitOfFruitToBeStored: number,
        amount: number = 0,
        createdAt?: Date
    ) {
        if (description.length > 30) {
            throw new Error("Description cannot exceed 30 characters.");
        }
        this.name = name;
        this.description = description;
        this.limitOfFruitToBeStored = limitOfFruitToBeStored;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    hasStoredAmount(): boolean {
        return this.amount > 0;
    }

    store(amountToStore: number): void {
        if (this.amount + amountToStore > this.limitOfFruitToBeStored) {
            throw new Error("Storage limit exceeded.");
        }
        this.amount += amountToStore;
    }

    remove(amountToRemove: number): void {
        if (this.amount < amountToRemove) {
            throw new Error("Not enough fruits in storage to remove.");
        }
        this.amount -= amountToRemove;
    }

    update(newDescription: string, newLimit: number): void {
        if (newDescription.length > 30) {
            throw new Error("Description cannot exceed 30 characters.");
        }

        this.description = newDescription;
        this.limitOfFruitToBeStored = newLimit;
    }
}

export default FruitEntity;
