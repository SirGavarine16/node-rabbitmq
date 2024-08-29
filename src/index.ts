import amqp from "amqplib/callback_api";

import { env } from "./configs/env";
import { createApp } from "./app";

const { user, pass, host, port, exchange } = env.rabbitmq;

amqp.connect( `amqp://${user}:${pass}@${host}:${port}/`, (connectionError, connection) => {
    if (connectionError) {
        console.error("Connection error on consumer", connectionError);
        return;
    }

    connection.createChannel((channelError, channel) => {
        if (channelError) {
            console.error("Connection error on consumer", channelError);
            return;
        }

        channel.assertExchange(exchange, 'fanout', {
            durable: false,
        });

        channel.assertQueue("", {
            exclusive: true,
        }, (queueError, { queue }) => {
            if (queueError) {
                console.error("Queue error on consumer", queueError);
                return;
            }

            channel.bindQueue(queue, exchange, "");
            
            channel.consume(queue, (payload) => {
                if (payload) {
                    const data = JSON.parse(payload.content.toString());
                    console.log("RECEIVED", data);
                }
            }, {
                noAck: true,
            });
        });
    });
});

const runServer = async () => {
    const { app, port } = await createApp();

    app.listen(port, () => {
        console.log(`> Server listening on port ${port}`);
    });
}

runServer();