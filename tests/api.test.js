const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comment');

const { connect, disconnect } = require('../db');

jest.setTimeout(15000);

beforeAll(async () => {
    await connect();
});

afterAll(async () => {
    await disconnect();
});

describe('API Tests', () => {
    let profileId;
    let userId;
    let commentId;

    test('POST /profiles should create a new profile', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Test Profile',
                description: 'description 123',
                mbti: 'INFP'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Test Profile');
        profileId = res.body.id;
    });

    test('POST /profiles should fail when invalid MBTI is provided', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Invalid',
                description: 'description 123',
                mbti: 'INVALID'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('GET /profiles/:id should return profile template', async () => {
        const res = await request(app).get(`/profiles/${profileId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Test Profile');
    });

    test('POST /users should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({ name: 'Test User' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Test User');
        userId = res.body.id;
    });

    test('POST /profiles/:profileId/comments should create a new comment/vote', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Great Profile',
                text: 'Amazinf!',
                mbti: 'INFP'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual('Great Profile');
        commentId = res.body.id;
    });

    test('POST /profiles/:profileId/comments should fail with invalid Enneagram', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Invalid Comment',
                text: 'Invalid enneagram',
                enneagram: 'INVALID'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('GET /profiles/:profileId/comments should return comments for a profile', async () => {
        const res = await request(app)
            .get(`/profiles/${profileId}/comments`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toEqual('Great Profile');
    });

    test('POST /profiles/:profileId/comments/:id/like should like/unlike a comment', async () => {
        // Like
        let res = await request(app)
            .post(`/profiles/${profileId}/comments/${commentId}/like`)
            .send({ userId });
        expect(res.statusCode).toEqual(200);
        expect(res.body.likes).toContain(userId);

        // Unlike
        res = await request(app)
            .post(`/profiles/${profileId}/comments/${commentId}/like`)
            .send({ userId });
        expect(res.statusCode).toEqual(200);
        expect(res.body.likes).not.toContain(userId);
    });

    test('GET /profiles/:profileId/comments with filtering', async () => {
        const res = await request(app)
            .get(`/profiles/${profileId}/comments`)
            .query({ filter: 'mbti' });
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].mbti).toEqual('INFP');
    });

    test('GET /profiles/:profileId/comments with sorting', async () => {
        // Create another comment with like
        const otherUserRes = await request(app)
            .post('/users')
            .send({ name: 'Other User' });
        const otherUserId = otherUserRes.body.id;

        const secondCommentRes = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId: otherUserId,
                title: 'Best Comment',
                text: 'this is liked',
                mbti: 'INFP'
            });
        const secondCommentId = secondCommentRes.body.id;

        // Like the second comment
        await request(app)
            .post(`/profiles/${profileId}/comments/${secondCommentId}/like`)
            .send({ userId });

        // Get best comments
        const res = await request(app)
            .get(`/profiles/${profileId}/comments`)
            .query({ sort: 'best' });

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].title).toEqual('Best Comment');
    });

    test('GET /personalities should return all available perdsonalities', async () => {
        const res = await request(app).get('/personalities');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mbti');
        expect(res.body).toHaveProperty('enneagram');
        expect(res.body).toHaveProperty('zodiac');
        expect(res.body.mbti).toContain('INFP');
    });

    test('POST /profiles/:profileId/comments should allow optional voting (none selected)', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'No Vote',
                text: 'Just a comment without voting',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.mbti).toBeUndefined();
    });

    test('POST /profiles/:profileId/comments should allow partial voting (only MBTI)', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Partial Vote',
                text: 'Only voted for MBTI',
                mbti: 'INFP'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.mbti).toEqual('INFP');
    });
});
