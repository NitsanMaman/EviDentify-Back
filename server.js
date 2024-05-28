const express = require('express');
const mongoose = require('mongoose');
const Form = require('./models/Form');
const cors = require('cors');
const app = express();
app.use(express.json({limit : 52428800}))
app.use(cors());

const bodyParser = require('body-parser');

// Increase the limit to, for example, 50mb
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

mongoose.connect('mongodb+srv://nitmaman:X0nN63CD3z8HTFNy@cluster0.4lgymya.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));

app.post('/submit-form', async (req, res) => {
  const { fullName, witnesses, job, email, mobileNumber, dateOfIdentify, category, description, photo, signature, uid, location, prevStation, currentStation, nextStation, specialHandle } = req.body;
  
  const newForm = new Form({
    fullName,
    witnesses,
    job,
    email,
    mobileNumber,
    dateOfIdentify: new Date(dateOfIdentify),
    category,
    description,
    photo,
    signature,
    uid,
    location: {
      type: "Point",
      coordinates: location.coordinates,
      description: location.description // Ensure this field is included here
    },
    prevStation,
    currentStation,
    nextStation,
    specialHandle
  });

  try {
    await newForm.save();
    res.status(201).json({ message: 'Form data saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/get-form-data/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const form = await Form.findOne({ uid: uid });
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/forms/:uidPrefix', async (req, res) => {
  const uidPrefix = req.params.uidPrefix;
  try {
    const forms = await Form.find({ uid: { $regex: `^${uidPrefix}` } });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error: error.message });
  }
});

// DELETE endpoint to remove a form based on UID
app.delete('/delete-form/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await Form.deleteOne({ uid: uid });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No form found with that UID.' });
    }
    res.status(200).json({ message: 'Form successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
