import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT,
    rabbitmq: {
        host: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        user: process.env.RABBITMQ_USER,
        pass: process.env.RABBITMQ_PASS,
        queue: process.env.RABBITMQ_QUEUE || "",
    },
};
