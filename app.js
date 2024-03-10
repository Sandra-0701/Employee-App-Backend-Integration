const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();
// Task1: initiate app and run server at 3000

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

mongoose.connect(process.env.mongoDB_URL).then(()=>{
    console.log('DB is connected'); //Mongodb connection code
})
.catch(()=>{
    console.log('connection Error!!!');
})


// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Load Employee model
const employeeSchema = mongoose.Schema(
    {
        name: String,
    location: String,
    position: String,
    salary: String
    },
    { versionKey: false }
);


const Employee = mongoose.model('Employee', employeeSchema);


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below


//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});




//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
      console.log('Updating employees with data:', req.body);
  
      
      const query = { _id: req.body._id };
  
      const updateResult = await Employee.updateMany(
        query,
        { $set: { ...req.body } },
        { new: true }
      );
  
      if (updateResult.nModified === 0) {
        return res.status(404).json({ error: 'No employees found to update' });
      }
  
      console.log('Number of documents modified:', updateResult.nModified);
      res.status(200).json({ message: 'Employees updated successfully' });
    } catch (error) {
      console.error('Error updating employees:', error);
      res.status(400).json({ error: 'Bad Request' });
    }
  });

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});