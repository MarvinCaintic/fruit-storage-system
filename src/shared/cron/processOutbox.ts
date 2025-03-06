import fs from "fs";
import eventEmitter from "../utils/eventEmitter";
const cron = require('node-cron');

const filePath = "./outbox.json";
const processedFilePath = "./processed.json";

// Listen to events and store in an "outbox"
eventEmitter.on("fruitCreated", (fruit) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitCreated", data: fruit }) + "\n");
});

eventEmitter.on("fruitDeleted", (name) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitDeleted", data: name }) + "\n");
});

eventEmitter.on("fruitUpdated", (fruit) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitUpdated", data: fruit }) + "\n");
});

eventEmitter.on("fruitStored", (fruit) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitStored", data: fruit }) + "\n");
});

eventEmitter.on("fruitRemoved", (fruit) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitRemoved", data: fruit }) + "\n");
});

const processedIds = new Set<string>();

function atomicWriteFile(filePath: string, data: string) {
    const tempFilePath = `${filePath}.tmp`;
    fs.writeFileSync(tempFilePath, data);
    fs.renameSync(tempFilePath, filePath);
}


// Function to process outbox events
async function processOutboxEvents() {
    try {
        const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
        const processedEvents = [];

        for (const line of lines) {
            try {
                const event = JSON.parse(line);

                // Skip duplicates
                if (processedIds.has(event.data.id)) {
                    console.log(`Skipping duplicate: ${event.data.id}`);
                    continue;
                }

                console.log(`Processing: ${event.event}`, event.data);

                // Simulate processing logic
                await simulateEventProcessing(event);

                processedIds.add(event.data.id);
                processedEvents.push(event);
            } catch (eventError) {
                console.error(`Failed to process event: ${line}`, eventError);
            }
        }

        if (processedEvents.length) {
            atomicWriteFile(processedFilePath, processedEvents.map(e => JSON.stringify(e)).join("\n") + "\n");
        }

        fs.writeFileSync(filePath, ""); // Clear outbox
    } catch (error) {
        console.error("Failed to process outbox events", error);
    }
}

// Simulate external service or database operation
async function simulateEventProcessing(event: any) {
    console.log(`Simulating processing for event ${event.event}`);
    // Simulate async processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
}


let isProcessing = false;

export function startOutboxProcessor() {
    isProcessing = true;
    console.log("Outbox processor started.");
}

export function stopOutboxProcessor() {
    isProcessing = false;
    console.log("Outbox processor stopped.");
}

// Process outbox every 10 sec (ensuring at-least-once delivery)
const outboxJob = cron.schedule('*/10 * * * * *', async () => {
    if (isProcessing) {
        await processOutboxEvents();
    }
});

// Stop cron job when needed
export function stopCronJob() {
    outboxJob.stop();
}
