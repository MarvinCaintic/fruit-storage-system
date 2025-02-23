import EventEmitter from "events";
let cron = require('node-cron');
import fs from "fs";
import eventEmitter from "../utils/eventEmmiter";

const filePath = "./outbox.json";

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

    // Process each event line
    for (const line of lines) {
        const event = JSON.parse(line);
        console.log(`Processing event: ${event.event}`, event.data);
        fs.writeFileSync(filePath, "");

    }
}

// Process outbox every 10 sec (ensuring at-least-once delivery)
cron.schedule('*/10 * * * * *', processOutboxEvents);
