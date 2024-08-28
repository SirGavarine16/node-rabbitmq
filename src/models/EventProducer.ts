import amqp from "amqplib/callback_api";

import { env } from "../configs/env";

const { user, pass, host, port, queue } = env.rabbitmq;

export class EventProducer {
  private rabbit: typeof amqp;
  private connectionString: string;

  constructor() {
    this.rabbit = amqp;
    this.connectionString = `amqp://${user}:${pass}@${host}:${port}/`;
  }

  execute(payload: any) {
    this.rabbit.connect(this.connectionString, (connectionError, connection) => {
        if (connectionError) {
            console.error("Connection error on producer", connectionError);
            return;
        }

        connection.createChannel((channelError, channel) => {
            if (channelError) {
                console.error("Channel error on producer", channelError);
                return;
            }

            const data = JSON.stringify(payload);

            channel.assertQueue(queue, {
                durable: false,
            });

            channel.sendToQueue(queue, Buffer.from(data));
        });
      }
    );
  }
}
