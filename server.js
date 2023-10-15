// Импорт необходимых библиотек.
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// Connecting to MongoDB.
// In this case, we connect to the local database at 'mongodb://127.0.0.1:27017/formDB'.
mongoose
  .connect('mongodb://127.0.0.1:27017/formDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB')) // If the connection was successful, we display a message about this.
  .catch((error) => console.error('Could not connect to MongoDB', error)) // In case of an error, we display an error message.

// Creating a new Express application.
const app = express()

// Using middleware to resolve cross-domain requests.
app.use(cors()) // Allow cross-domain requests from all domains.
app.use(express.json()) // Enable support for JSON requests.

// Define a schema for responses.
const answerSchema = new mongoose.Schema({
  answers: [{ question: String, answer: String }], // A schema consists of an array of objects, each of which contains a question and an answer.
})

// Define a model for responses.
const Answer = mongoose.model('Answer', answerSchema) // Creating a model based on a diagram. The model will be used to create and read documents from MongoDB.
// Handling POST requests to URL '/submit'.
app.post('/submit', (req, res) => {
  // Create a new response object based on data from the request body.
  const newAnswer = new Answer({
    answers: req.body.answers,
  })

  // Saving the new response object to the database.
  newAnswer
    .save()
    .then(() => res.json({ message: 'Answer saved successfully' })) // If the saving was successful, we send a response with a success message.
    .catch((error) => {
      console.error(error) // In case of an error, we display an error message.
      res.status(500).json({ error: 'Failed to save answer' }) // We send a response with status 500 (internal server error) and an error message.
    })
})

// Determining the port on which the server will operate.
const PORT = process.env.PORT || 5500
// Starting the server.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
