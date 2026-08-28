# Kubernetes Integration Test

Test API built with Fastify, TypeScript, and Swagger/OpenAPI. The repo includes a Dockerfile and Kubernetes manifests, including a local Kind configuration and an Argo CD application.

## Stack

- Node.js 22
- Fastify
- TypeScript
- Swagger UI
- Docker
- Kubernetes / Kind
- Argo CD

## Requirements

- Node.js 22 or compatible
- npm
- Docker
- kubectl
- kind, if you want to create the local cluster included in the repo

## Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Available variable:

```env
PORT=3000
```

If `PORT` is not defined, the API uses port `3000`.

## Installation

```bash
npm install
```

## Local Usage

Compile TypeScript:

```bash
npm run build
```

Start the compiled API:

```bash
npm start
```

The API is available at:

```text
http://localhost:3000
```

The development script is defined as:

```bash
npm run dev
```

That command uses `tsx`, so the project needs `tsx` installed as a development dependency to run it.

## Swagger Documentation

The OpenAPI documentation is served with Swagger UI at:

```text
http://localhost:3000/docs
```

The main configuration is in `src/plugins/swagger.ts`.

## Endpoints

### Health check

```http
GET /health
```

Response:

```json
{
  "status": "up"
}
```

### Hello

```http
POST /hello
Content-Type: application/json
```

Body:

```json
{
  "nombre": "Javier",
  "apellido": "Estrada",
  "comidaFavorita": "Pizza"
}
```

Response:

```json
{
  "nombreCompleto": "Javier Estrada",
  "comidaFavorita": "Pizza"
}
```

Example with `curl`:

```bash
curl -X POST http://localhost:3000/hello \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Javier","apellido":"Estrada","comidaFavorita":"Pizza"}'
```

## Docker

Build the image:

```bash
docker build -t kubernetes-integration-test:latest .
```

Run the container:

```bash
docker run --rm -p 3000:3000 kubernetes-integration-test:latest
```

## Kubernetes with Kind

Create the local cluster:

```bash
kind create cluster --config kind/kind-config.yaml
```

Load the local image into Kind:

```bash
kind load docker-image kubernetes-integration-test:latest --name mi-cluster-local
```

Apply the manifests:

```bash
kubectl apply -f k8s/deployment.yaml
```

Verify the resources:

```bash
kubectl get pods
kubectl get svc
```

The service exposes host port `30080` and forwards traffic to container port `3000`:

```text
http://localhost:30080
```

Swagger UI en Kubernetes:

```text
http://localhost:30080/docs
```

## Argo CD

The `k8s/argo-deploy.yaml` manifest defines an Argo CD application named `fastify-api-app`.

Apply the application:

```bash
kubectl apply -f k8s/argo-deploy.yaml
```

The application syncs the `k8s` path from the repository:

```text
https://github.com/JavierEdev/kubernetes-integration-test
```

## Scripts

```bash
npm run build
npm start
npm run dev
npm test
```

Note: `npm test` currently contains the default placeholder and does not run real tests.
