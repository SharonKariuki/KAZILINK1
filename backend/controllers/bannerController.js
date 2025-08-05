const Banner = require('../models/Banner');

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

exports.addBanner = async (req, res) => {
  try {
    const { imageUrl, title, link } = req.body;
    const banner = await Banner.create({ imageUrl, title, link });
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add banner' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};
