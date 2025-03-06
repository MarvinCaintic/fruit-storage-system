class FruitEntity {
    private constructor(
        private name: string,
        private description: string,
        private limitOfFruitToBeStored: number,
        private amount: number,
        private createdAt?: Date
    ) {}

    static createFruit(
        name: string,
        description: string,
        limitOfFruitToBeStored: number,
        amount?: number,
        createdAt?: Date
    ): FruitEntity {
        if (!name || !description || limitOfFruitToBeStored <= 0) {
            throw new Error('Invalid fruit data.');
        }
        if ((amount || 0) > limitOfFruitToBeStored) {
            throw new Error("Amount exceeds the storage limit 1");
        }
        if (description.length > 30) {
            throw new Error("Description cannot exceed 30 characters.");
        }
        return new FruitEntity(name, description, limitOfFruitToBeStored, amount ?? 0, createdAt ?? new Date());
    }

    getName(): string { return this.name; }
    getDescription(): string { return this.description; }
    getLimit(): number { return this.limitOfFruitToBeStored; }
    getAmount(): number { return this.amount; }
    getCreatedAt(): Date | undefined { return this.createdAt; }

    hasStoredAmount(): boolean { return this.amount > 0; }

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

    update(newDescription: string | null, newLimit: number | null): void {
        // Update description if newDescription is not null
        if (newDescription !== null) {
            if (newDescription.length > 30) {
                throw new Error("Description cannot exceed 30 characters.");
            }
            this.description = newDescription;
        }

        // Update limit if newLimit is not null
        if (newLimit !== null) {
            this.limitOfFruitToBeStored = newLimit;
        }
    }
}

export default FruitEntity;
