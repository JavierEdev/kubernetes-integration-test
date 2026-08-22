import Fastify from 'fastify';

import {registerSwagger} from './plugins/swagger.js';
import type {HelloRequest} from './models/Request/Hello.js';
import type {HelloResponse} from './models/Response/Hello.js';
import type {HealthResponse} from './models/Response/Health.js';

const fastify = Fastify({logger: true})

await registerSwagger(fastify);

fastify.get<{ Reply: HealthResponse }>('/health', {
    schema: {
        tags: ['Health'],
        summary: 'Health check',
        response: {
            200: {
                type: 'object',
                properties: {
                    status: {type: 'string'}
                }
            }
        }
    }
}, async (request, reply) => {
    return reply.send({status: 'up'})
})

fastify.post<{ Body: HelloRequest; Reply: HelloResponse }>('/hello', {
    schema: {
        tags: ['Hello'],
        summary: 'Create hello response',
        body: {
            type: 'object',
            required: ['nombre', 'apellido', 'comidaFavorita'],
            properties: {
                nombre: {type: 'string'},
                apellido: {type: 'string'},
                comidaFavorita: {type: 'string'}
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    nombreCompleto: {type: 'string'},
                    comidaFavorita: {type: 'string'}
                }
            }
        }
    }
}, async (request, reply) => {
    const body = request.body;

    return reply.send({
        nombreCompleto: `${body.nombre} ${body.apellido}`,
        comidaFavorita: body.comidaFavorita
    });
});

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
