const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

module.exports = function () {

  /**
   * @openapi
   * /profiles:
   *   post:
   *     summary: Create a new profile
   *     tags: [Profiles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               mbti:
   *                 type: string
   *               enneagram:
   *                 type: string
   *     responses:
   *       201:
   *         description: Profile created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Profile'
   */
  router.post('/', async (req, res, next) => {
    try {
      const profile = new Profile(req.body);
      await profile.save();
      res.status(201).json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  /**
   * @openapi
   * /profiles/{id}:
   *   get:
   *     summary: Get profile by ID
   *     tags: [Profiles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Profile details rendered as HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *       404:
   *         description: Profile not found
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
      res.render('profile_template', {
        profile: profile,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Default route (for the original functionality, let's keep it or redirect/handle)
  router.get('/', async (req, res, next) => {
    try {
      // For demonstration, just get the first profile or return a message
      const profile = await Profile.findOne();
      if (!profile) {
        // Create a default one if none exists for backward compatibility
        const defaultProfile = new Profile({
          "name": "A Martinez",
          "description": "Adolph Larrue Martinez III.",
          "mbti": "ISFJ",
          "enneagram": "9w3",
          "variant": "sp/so",
          "tritype": 725,
          "socionics": "SEE",
          "sloan": "RCOEN",
          "psyche": "FEVL",
          "image": "https://soulverse.boo.world/images/1.png",
        });
        await defaultProfile.save();
        return res.render('profile_template', { profile: defaultProfile });
      }
      res.render('profile_template', {
        profile: profile,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

