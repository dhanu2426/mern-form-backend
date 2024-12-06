const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors({
  origin: 'https://unique-dragon-3b7014.netlify.app', // Frontend domain
  methods: ['GET', 'POST'],
  credentials: true
})); // Enables CORS

// MongoDB Connection
const mongoURI = 'mongodb+srv://baikandhanusha24:7815834749@cluster0.lauom.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// MongoDB Schema and Model
const formSchema = new mongoose.Schema({
  title: String,
  headerImage: String,  // New field for header image URL
  questions: [String],
  responses: [
    {
      userId: String,
      answers: [String],
    },
  ],
});

const Form = mongoose.model('Form', formSchema);

// Routes

// GET: Fetch All Forms
app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create a New Form
app.post('/forms', async (req, res) => {
  try {
    const { title, headerImage, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    const newForm = new Form({
      title,
      headerImage,  // Save header image URL
      questions,
      responses: [],
    });

    await newForm.save();
    res.status(201).json({ message: 'Form created successfully', form: newForm });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Fetch a Single Form by ID
app.get('/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Submit Responses for a Form
app.post('/forms/:id/responses', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Ensure all answers are provided
    if (answers.length !== form.questions.length) {
      return res.status(400).json({ message: "All questions must be answered" });
    }

    // Push the user's response into the responses array
    form.responses.push({
      userId: userId || null,  // Save the user ID or null if no user
      answers: answers, // Save the answers as an array
    });

    await form.save(); // Save the updated form

    res.status(200).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
