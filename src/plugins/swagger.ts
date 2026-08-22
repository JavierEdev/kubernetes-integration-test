import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import type {FastifyInstance} from 'fastify';

export async function registerSwagger(fastify: FastifyInstance) {
    await fastify.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Kubernetes Integration Test API',
                description: 'API de pruebas con Fastify',
                version: '1.0.0'
            }
        }
    });

    await fastify.register(swaggerUi, {
        routePrefix: '/docs'
    });
}
