const express = require('express');
const router = express.Router();
const { MBTI, ENNEAGRAM, ZODIAC } = require('../constants/personality');

module.exports = function () {
    /**
     * @openapi
     * /personalities:
     *   get:
     *     summary: Get available personalites
     *     tags: [Personalities]
     *     responses:
     *       200:
     *         description: JSON object containing MBTI, Enneagram, and Zodiac types
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Personalities'
     */
    router.get('/', (req, res) => {
        res.json({
            mbti: MBTI,
            enneagram: ENNEAGRAM,
            zodiac: ZODIAC
        });
    });

    return router;
};
