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

    test('POST /profiles should create profile with valid Enneagram', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Enneagram Profile',
                description: 'Testing enneagram',
                enneagram: '4w5'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.enneagram).toEqual('4w5');
    });

    test('POST /profiles should fail when invalid Enneagram is provided', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Invalid Enneagram',
                description: 'description 123',
                enneagram: '10w11'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('POST /profiles should create profile with valid Zodiac', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Zodiac Profile',
                description: 'Testing zodiac',
                zodiac: 'Leo'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.zodiac).toEqual('Leo');
    });

    test('POST /profiles should fail when invalid Zodiac is provided', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Invalid Zodiac',
                description: 'description 123',
                zodiac: 'InvalidSign'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('POST /profiles should create profile with all personality types', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Complete Profile',
                description: 'All personality type',
                mbti: 'ENFJ',
                enneagram: '2w3',
                zodiac: 'Pisces'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.mbti).toEqual('ENFJ');
        expect(res.body.enneagram).toEqual('2w3');
        expect(res.body.zodiac).toEqual('Pisces');
    });

    test('POST /profiles should create profile with all attributes', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Full Profile',
                description: 'Profile with all attributes',
                mbti: 'INTJ',
                enneagram: '5w6',
                zodiac: 'Capricorn',
                variant: 'sp/sx',
                tritype: 538,
                socionics: 'ILI',
                sloan: 'RCOEI',
                psyche: 'LVEF',
                temperaments: 'Phlegmatic'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Full Profile');
        expect(res.body.mbti).toEqual('INTJ');
        expect(res.body.enneagram).toEqual('5w6');
        expect(res.body.zodiac).toEqual('Capricorn');
        expect(res.body.variant).toEqual('sp/sx');
        expect(res.body.tritype).toEqual(538);
        expect(res.body.socionics).toEqual('ILI');
        expect(res.body.sloan).toEqual('RCOEI');
        expect(res.body.psyche).toEqual('LVEF');
        expect(res.body.temperaments).toEqual('Phlegmatic');
        profileId = res.body.id;
    });

    test('POST /profiles should create profile with only required fields', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Minimal Profile',
                description: 'Only required fields'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Minimal Profile');
        expect(res.body.description).toEqual('Only required fields');
        // Optional fields should be undefined
        expect(res.body.mbti).toBeUndefined();
        expect(res.body.variant).toBeUndefined();
        expect(res.body.tritype).toBeUndefined();
    });

    test('POST /profiles should create profile with partial attributes', async () => {
        const res = await request(app)
            .post('/profiles')
            .send({
                name: 'Partial Profile',
                description: 'Some attributes',
                mbti: 'ESFP',
                variant: 'so/sp',
                tritype: 279
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.mbti).toEqual('ESFP');
        expect(res.body.variant).toEqual('so/sp');
        expect(res.body.tritype).toEqual(279);
        expect(res.body.enneagram).toBeUndefined();
        expect(res.body.zodiac).toBeUndefined();
    });

    test('GET /profiles/:id should return profile template with profile attributes', async () => {
        const res = await request(app).get(`/profiles/${profileId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Full Profile');
        expect(res.text).toContain('Profile with all attributes');
        expect(res.text).toContain('INTJ');
        expect(res.text).toContain('5w6');
        expect(res.text).toContain('sp/sx');
        expect(res.text).toContain('ILI');
        expect(res.text).toContain('RCOEI');
        expect(res.text).toContain('LVEF');
        expect(res.text).toContain('Phlegmatic');
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

    test('POST /profiles/:profileId/comments should fail with invalid MBTI', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Invalid MBTI Comment',
                text: 'Invalid mbti type',
                mbti: 'XXXX'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('POST /profiles/:profileId/comments should fail with invalid Zodiac', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Invalid Zodiac Comment',
                text: 'Invalid zodiac sign',
                zodiac: 'NotASign'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    test('POST /profiles/:profileId/comments should create comment with valid Zodiac', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Zodiac Comment',
                text: 'Valid zodiac vote',
                zodiac: 'Scorpio'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.zodiac).toEqual('Scorpio');
    });

    test('POST /profiles/:profileId/comments should create comment with all personality votes', async () => {
        const res = await request(app)
            .post(`/profiles/${profileId}/comments`)
            .send({
                userId,
                title: 'Complete Vote',
                text: 'All three personality types',
                mbti: 'ENTJ',
                enneagram: '8w7',
                zodiac: 'Aries'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.mbti).toEqual('ENTJ');
        expect(res.body.enneagram).toEqual('8w7');
        expect(res.body.zodiac).toEqual('Aries');
    });

    test('GET /profiles/:profileId/comments should return comments for a profile', async () => {
        const res = await request(app)
            .get(`/profiles/${profileId}/comments`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(3);
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
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].mbti).toBeDefined();
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
