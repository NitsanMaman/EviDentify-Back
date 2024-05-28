const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  fullName: String,
  witnesses: [String],
  job: String,
  email: String,
  mobileNumber: String,
  dateOfIdentify: Date,
  category: String,
  description: String,
  photo: String,
  signature: String,
  uid: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
    description: String  
  },
  prevStation: String,
  currentStation: String,
  nextStation: String,
  specialHandle: [String]
});


const Form = mongoose.model('Form', formSchema);

module.exports = Form;
