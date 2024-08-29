import amqp from "amqplib/callback_api";

import { env } from "./configs/env";
import { createApp } from "./app";

const { user, pass, host, port, exchange, keys } = env.rabbitmq;

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

        channel.assertExchange(exchange, 'direct', {
            durable: false,
        });

        channel.assertQueue("", {
            exclusive: true,
        }, (queueError, { queue }) => {
            keys.forEach((routingKey) => {
                channel.bindQueue(queue, exchange, routingKey);
            });

            
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