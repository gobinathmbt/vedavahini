const express = require("express");
const app = express.Router();
const task = require("../controllers/task");

 
 app.get("/get_task", task.get_task);
app.post("/create_task", task.create_task);
app.put("/edit_task/:uid", task.edit_task);
app.put("/mark_task/:uid", task.mark_task);
app.delete("/delete_task/:uid", task.delete_task);
 
 
module.exports = app;