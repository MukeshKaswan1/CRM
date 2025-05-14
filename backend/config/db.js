const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/syndie';  // for local MongoDB
// OR use MongoDB Atlas connection string if using the cloud

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));