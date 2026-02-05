const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/Comment');

module.exports = function () {
    /**
     * @openapi
     * /profiles/{profileId}/comments:
     *   post:
     *     summary: Create a comment (with personality vote) for a profile
     *     tags: [Profile Comments]
     *     parameters:
     *       - in: path
     *         name: profileId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *               title:
     *                 type: string
     *               text:
     *                 type: string
     *               mbti:
     *                 type: string
     *               enneagram:
     *                 type: string
     *               zodiac:
     *                 type: string
     *     responses:
     *       201:
     *         description: Comment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     */
    router.post('/', async (req, res) => {
        try {
            const { profileId } = req.params;
            const { userId, title, text, mbti, enneagram, zodiac } = req.body;
            const comment = new Comment({
                profileId,
                userId,
                title,
                text,
                mbti,
                enneagram,
                zodiac
            });
            await comment.save();
            res.status(201).json(comment);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    /**
     * @openapi
     * /profiles/{profileId}/comments:
     *   get:
     *     summary: Get comments of a profile
     *     tags: [Profile Comments]
     *     parameters:
     *       - in: path
     *         name: profileId
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: filter
     *         schema:
     *           type: string
     *         description: Personality system to filter by (mbti, enneagram, zodiac)
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *         description: Sort order (recent, best)
     *     responses:
     *       200:
     *         description: List of comments
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Comment'
     */
    router.get('/', async (req, res) => {
        try {
            const { profileId } = req.params;
            const { filter, sort } = req.query;

            let query = { profileId };

            if (filter) {
                if (['mbti', 'enneagram', 'zodiac'].includes(filter.toLowerCase())) {
                    query[filter.toLowerCase()] = { $exists: true, $ne: null };
                }
            }

            let sortQuery = { createdAt: -1 };
            if (sort === 'best') {
                const comments = await Comment.find(query).populate('userId', 'name');
                comments.sort((a, b) => b.likes.length - a.likes.length);
                return res.json(comments);
            }

            const comments = await Comment.find(query)
                .populate('userId', 'name')
                .sort(sortQuery);

            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    /**
     * @openapi
     * /profiles/{profileId}/comments/{id}/like:
     *   post:
     *     summary: Toggle like/unlike a comment
     *     tags: [Profile Comments]
     *     parameters:
     *       - in: path
     *         name: profileId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Updated comment with like status
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     */
    router.post('/:id/like', async (req, res) => {
        try {
            const { userId } = req.body;
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const likeIndex = comment.likes.indexOf(userId);
            if (likeIndex > -1) {
                comment.likes.splice(likeIndex, 1);
            } else {
                comment.likes.push(userId);
            }

            await comment.save();
            res.json(comment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
