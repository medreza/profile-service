const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Boo Profile Service API',
            version: '1.0.0',
            description: 'API documentation for Boo Profile Service',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
        components: {
            schemas: {
                Profile: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        mbti: { type: 'string' },
                        enneagram: { type: 'string' },
                        zodiac: { type: 'string' },
                        variant: { type: 'string' },
                        tritype: { type: 'number' },
                        socionics: { type: 'string' },
                        sloan: { type: 'string' },
                        psyche: { type: 'string' },
                        temperaments: { type: 'string' },
                        image: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        profileId: { type: 'string' },
                        userId: {
                            oneOf: [
                                { type: 'string' },
                                { $ref: '#/components/schemas/User' }
                            ]
                        },
                        title: { type: 'string' },
                        text: { type: 'string' },
                        mbti: { type: 'string', nullable: true },
                        enneagram: { type: 'string', nullable: true },
                        zodiac: { type: 'string', nullable: true },
                        likes: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Personalities: {
                    type: 'object',
                    properties: {
                        mbti: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        enneagram: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        zodiac: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
