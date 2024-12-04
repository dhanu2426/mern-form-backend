const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: String, required: true }],
  responses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User (optional)
      answers: [{ type: String }]  // Array of answers corresponding to questions
    }
  ],
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
