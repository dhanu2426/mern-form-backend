const express = require('express');
const Form = require('../models/Form');

const router = express.Router();

// Add a form
router.post('/add', async (req, res) => {
  try {
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save form', error });
  }
});

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error });
  }
});

module.exports = router;
