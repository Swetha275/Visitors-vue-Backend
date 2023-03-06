const express = require('express');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const { User } = require('./Model/model.js');
require('dotenv').config();
const { Employee } = require('./Model/employee.js');
const { LoginModel } = require('./Model/login.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe';
const bcrypt = require('bcrypt');

const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

app.get('/:email/show_users', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    const users = await User.find({
      $and: [{ inOut: { $eq: false } }, { offmail: { $eq: emailFilter } }],
    }).sort({ out_time: -1 });
    const response = users.map(
      ({ _id: id, registerName, registerAge, registerReferrel, registerPurpose, phoneNumber, email, address, in_time, out_time }) => ({
        id,
        registerName,
        registerAge,
        registerReferrel,
        registerPurpose,
        phoneNumber,
        email,
        address,
        in_time,
        out_time,
      })
    );
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.get('/:email/update_user', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    const users = await User.find({
      $and: [{ inOut: { $eq: true } }, { offmail: { $eq: emailFilter } }],
    });
    const response = users.map(
      ({ _id: id, registerName, registerAge, registerReferrel, registerPurpose, phoneNumber, email, address }) => ({
        id,
        registerName,
        registerAge,
        registerReferrel,
        registerPurpose,
        phoneNumber,
        email,
        address,
      })
    );
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});
app.patch('/delete_visitors', async (req, res) => {
  try {
    const user = await User.findById(req.body.id).exec();
    user.inOut = false;
    user.out_time = Date.now();
    await user.save();
    return res.status(201).send({ message: ' Success' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.patch('/delete_employee', async (req, res) => {
  try {
    const vari = await Employee.findByIdAndDelete(req.body.id);
    console.log(vari, 'wwwwwwwwwwwwwwwwwwwwwwwwwww');
    return res.status(201).send({ message: ' Success' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/add_visitors', async (req, res) => {
  try {
    const { registerName, registerAge, registerReferrel, registerPurpose, phoneNumber, email, offmail, address } = req.body;
    const in_time = Date.now();
    const out_time = Date.now();

    const user = new User({
      registerName,
      registerAge,
      registerReferrel,
      registerPurpose,
      phoneNumber,
      email,
      offmail,
      address,
      in_time,
      out_time,
    });
    await user.save();
    res.status(201).send({ message: 'Added successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/add_emp', async (req, res) => {
  try {
    const { Name, phNum, Email, offmail } = req.body;
    const employee = new Employee({
      Name,
      phNum,
      Email,
      offmail,
    });
    await employee.save();
    res.status(201).send({ message: 'Added successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});
app.get('/:email/show_employee', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    let employee = await Employee.find({ offmail: { $eq: emailFilter } });
    const response = employee.map(({ Name, phNum, Email }) => ({
      Name,
      phNum,
      Email,
    }));
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.patch('/:email/update_emp/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).send({ message: 'Updated' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.get('/:mail/get_employee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let employee = await Employee.find({ _id: id });
    console.log(employee);
    const response = employee.map(({ Name, phNum, Email, id }) => ({
      Name,
      phNum,
      Email,
      id,
    }));
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.get('/:email/comp_details', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    let company_history = await User.find({ offmail: { $eq: emailFilter } });
    const response = company_history.map(({ offmail, in_time, out_time, inOut }) => ({
      offmail,
      in_time,
      out_time,
      inOut,
    }));
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.get('/:email/comp_employee', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    let company_employee = await Employee.find({ offmail: { $eq: emailFilter } });
    const response = company_employee.map(({ id, offmail, Name, phNum, Email }) => ({
      id,
      offmail,
      Name,
      phNum,
      Email,
    }));
    return res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await LoginModel.findOne({ email });
    if (!user) {
      return res.json({ error: 'User Not found' });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {});
      if (res.status(201)) {
        if (user.changepw === false) {
          return res.json({ status: 'changepassword' });
        }
        return res.json({ status: 'ok', data: token });
      } else {
        return res.json({ error: 'error' });
      }
    }

    res.json({ status: 'error', error: 'InvAlid Password' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/registerorg', async (req, res) => {
  try {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const login = new LoginModel({
      email,
      password: encryptedPassword,
    });
    await login.save();
    res.status(201).send({ message: 'Added successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/:email/changepassword', async (req, res) => {
  try {
    const emailFilter = req.params.email;
    const { newpasword, confirmpasword, CurrentPasword } = req.body;
    const company = await LoginModel.findOne({ email: emailFilter });

    if (await bcrypt.compare(CurrentPasword, company.password)) {
      const encryptedPassword = await bcrypt.hash(confirmpasword, 10);
      company.changepw = true;
      company.password = encryptedPassword;
      await company.save();
      const token = jwt.sign({ email: company.email }, JWT_SECRET, {});
      if (res.status(201)) {
        return res.json({ status: 'ok', data: token });
      } else {
        return res.json({ error: 'error' });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: 'Error!' });
  }
});

app.post('/userData', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return 'token expired';
      }
      return res;
    });
    if (user == 'token expired') {
      return res.send({ status: 'error', data: 'token expired' });
    }

    const useremail = user.email;
    LoginModel.findOne({ email: useremail })
      .then(data => {
        res.send({ status: 'ok', data: data });
      })
      .catch(error => {
        res.send({ status: 'error', data: error });
      });
  } catch (error) {}
});

const start = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected...');
    app.listen(process.env.PORT, () => console.log('Server started on port 8000'));
  } catch (error) {
    console.error(`Error while connecting to mongoDB ${error}`);
    process.exit(1);
  }
};

start();
