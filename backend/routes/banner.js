const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// GET all banners
router.get('/', bannerController.getAllBanners);

// POST a new banner
router.post('/', bannerController.addBanner);

// DELETE a banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
