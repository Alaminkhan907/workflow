const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World from Node.js & MongoDB in Docker!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
