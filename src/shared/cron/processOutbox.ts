import fs from "fs";
import eventEmitter from "../utils/eventEmmiter";
const cron = require('node-cron');

const filePath = "./outbox.json";
const processedFilePath = "./processed.json";

// Listen to events and store in an "outbox"
eventEmitter.on("fruitCreated", (fruit) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitCreated", data: fruit }) + "\n");
});

eventEmitter.on("fruitDeleted", (name) => {
    fs.appendFileSync(filePath, JSON.stringify({ event: "fruitDeleted", data: { name } }) + "\n");
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

// Function to process outbox events
async function processOutboxEvents() {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
    let processedEvents = [];

    // Process each event line
    for (const line of lines) {
        const event = JSON.parse(line);
        processedEvents.push(event);
        console.log(`Processing event: ${event.event}`, event.data);
    }

    // Append processed events to processed.json
    if (processedEvents.length) {
        fs.appendFileSync(processedFilePath, processedEvents.map(e => JSON.stringify(e)).join("\n") + "\n");
    }

    fs.writeFileSync(filePath, ""); // Clear outbox after processing
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
