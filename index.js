const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//models

app.use("/static", express.static("public")); // connects the css  file to index.js but can also be used to connect  &  html  &  ejs

app.use(express.urlencoded({ extended: true })); // urlencoded middleware used to handle html form data without this body of data will be undefined

//view engine configuration
app.set("view engine", "ejs");


// GET METHOD
const version = 'v1'
app.get('/home', (req, res) => {
    console.log('The Client Is Trying To Call This API')

    //imports module from TodoTask.js as TodoTask
    const TodoTask = require("./models/TodoTask.js");
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });  // todoTasks is defined in line 35
    });
});

// POST METHOD -- post requests, normally used when creating some form of data. data comes from the html form and the post requests will make the data to be ready to be sent to the end route and save data to a database
// post requests allows the data from html form to be sent to the end route and to read the data and save onto database

app.post(`/${version}/home`, async (req, res) => {
    const TodoTask = require("./models/TodoTask.js");

    //todoTask is the new TodoTask schematic
    const todoTask = new TodoTask({
        content: req.body.content
    })
    try {
        // saving the content in database and label as data
        const data = await todoTask.save();
        res.redirect('/home');
    } catch (err) {
        res.json({
            msg: err
        })
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const TodoTask = require("./models/TodoTask.js");
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {     // what is the empty object for ?   
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id }); // how it task defined ?
        });
    })
    .post((req, res) => {
        const TodoTask = require("./models/TodoTask.js");
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect('/home');
        });
    });

// DELETE
app
    .route("/remove/:id").get((req, res) => {
        const TodoTask = require("./models/TodoTask.js");
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect('/home');
        });
    });


//connection to db

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(process.env.port, () => console.log(`The Server Is Started On: ${process.env.port}`));
});



//how does the website know if i click the add button it will send a post request to store the content ?
// how does the website know that if i click the edit button it will go to edit or if i click the delete button it will remove the item


console.log(1+1)