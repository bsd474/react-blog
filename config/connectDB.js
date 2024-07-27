const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
        //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
  } catch (error) {
    console.log('MongoDB connection failed', error);
  }
}