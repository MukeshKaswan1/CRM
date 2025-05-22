const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://mkaswan960:mukesh%40123@mini-crm.oxefzut.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));