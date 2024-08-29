import amqp from "amqplib/callback_api";

import { env } from "../configs/env";

const { user, pass, host, port, exchange } = env.rabbitmq;

export class EventProducer {
  private rabbit: typeof amqp;
  private connectionString: string;

  constructor() {
    this.rabbit = amqp;
    this.connectionString = `amqp://${user}:${pass}@${host}:${port}/`;
  }

  execute(payload: any, routingKey: string) {
    this.rabbit.connect(
      this.connectionString,
      (connectionError, connection) => {
        if (connectionError) {
          console.error("Connection error on producer", connectionError);
          return;
        }

        connection.createChannel((channelError, channel) => {
          if (channelError) {
            console.error("Channel error on producer", channelError);
            return;
          }

          channel.assertExchange(exchange, "direct", {
            durable: false,
          });

          const data = JSON.stringify(payload);

          channel.publish(exchange, routingKey, Buffer.from(data));
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      }
    );
  }
}
