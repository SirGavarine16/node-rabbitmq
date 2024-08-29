import express from "express";

import { env } from "./configs/env";
import { EventProducer } from "./models/EventProducer";

export const createApp = async () => {
    const app = express();
    
    const producer = new EventProducer();

    app.use(express.json());

    app.get('/health', (_, res) => {
        return res.status(200).json({
            message: "Server is up and running!",
        });
    });

    app.post('/broker/send', (req, res) => {
        const {
            event = "",
            payload = {},
            routingKey = "default",
        } = req.body;

        producer.execute({ event, payload }, routingKey);

        return res.status(201).json({
            message: "Data was sent to broker successfully!",
        });
    });

    app.use('/', (req, res) => {
        return res.status(400).json({
            message: `Endpoint with method ${req.method} was not found!`,
        });
    });

    return {
        app,
        port: env.port,
    }
}
