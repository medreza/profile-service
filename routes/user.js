const express = require('express');
const router = express.Router();
const User = require('../models/User');

module.exports = function () {
    /**
     * @openapi
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.post('/', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    // Get all users (helper for testing)
    router.get('/', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
