# Express + RabbitMQ Example

This is a sample project using a Node + Express.js app using TypeScript connected to a RabbitMQ server. The purpose is to test the creation of an event broker that may be useful when connecting microservices.

## Development

- RabbitMQ variables MUST be the same as the ones used to build the RabbitMQ server (port, user and pass).
- Only to endpoints are available: __GET /health__ to check the app status and __POST /broker/send__ which receives a JSON body with an "event" string and "payload" object.

## Testing

- First you need to have a RabbitMQ server running, or you may build the Docker image using this command:
```bash
docker-compose up -d
```
- To start the Express project, install the dependencies and then run the app:
```bash
npm i
npm start
```