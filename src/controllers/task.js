const crypto = require('crypto');
const Task = require("../model/model").Task;

const get_task = async (req, res) => {
  try {
    const tasks = await Task.find({ is_active: true, is_deleted: false ,is_read: false});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_task = async (req, res) => {
  if (!req.body.assigned) {
    return res.status(400).json({ message: "assigned is Required." });
  }

  if (!req.body.message) {
    return res.status(400).json({ message: "message is Required." });
  }

  const assigned = req.body.assigned;
  const message = req.body.message;

  const uid = crypto.randomBytes(16).toString("hex");
  const taskData = {
    uid: uid,
    assigned_by: assigned,
    message: message,
  };
  try {
    const task = new Task(taskData);
    await task.save();
    res.status(201).json({ message: "Task Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const edit_task = async (req, res) => {
  try {
    const taskUid = req.params.uid;

    if (!req.body.values.assigned) {
      return res.status(400).json({ message: "assigned_by is Required." });
    }

    if (!req.body.values.message) {
      return res.status(400).json({ message: "message is Required." });
    }

    const assigned = req.body.values.assigned;
    const message = req.body.values.message;

    const updatedData = {
      assigned_by: assigned,
      message: message,
    };

    const task = await Task.findOneAndUpdate({ uid: taskUid }, updatedData, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const mark_task = async (req, res) => {

  try {
    const taskUid = req.params.uid;

    const updatedData = {
      is_read: true,
    };

    const task = await Task.findOneAndUpdate({ uid: taskUid }, updatedData, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete_task = async (req, res) => {
  try {
    const taskUid = req.params.uid;
    if (!taskUid) {
      return res.status(400).json({ message: "Task UID is required" });
    }
    const task = await Task.findOneAndUpdate({ uid: taskUid }, { is_deleted: true }, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  get_task: get_task,
  create_task: create_task,
  edit_task: edit_task,
  delete_task: delete_task,
  mark_task:mark_task,
};