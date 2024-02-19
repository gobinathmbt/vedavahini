import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:8083";

const validationSchema = Yup.object().shape({
  assigned: Yup.string()
    .required("Assigned_by is required")
    .max(30, "Assigned_by must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  message: Yup.string()
    .required("Message is required")
    .max(100, "Message must be at most 100 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
});

const TaskTable = () => {
  const [task, settask] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedTasks, setselectedTasks] = useState({});

  useEffect(() => {
    fetchtask();
  }, []);

  const fetchtask = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_task`);
      settask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleEditModalOpen = (task) => {
    setselectedTasks(task);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
  };

  const handleDeleteConfirmationOpen = (task) => {
    setselectedTasks(task);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleEdittask = async (values) => {
    try {
      await axios.put(`${API_URL}/edit_task/${selectedTasks.uid}`, { values });
      fetchtask();
      handleEditModalClose();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };
  
  const handleMarkAsRead = async (values) => {
    console.log(values)
    try {
      await axios.put(`${API_URL}/mark_task/${values.uid}`, { values });
      fetchtask();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleAddtask = async (values) => {
    try {
      await axios.post(`${API_URL}/create_task`, {
        assigned: values.assigned,
        message: values.message,
      });
      fetchtask();
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeletetask = async () => {
    try {
      await axios.delete(`${API_URL}/delete_task/${selectedTasks.uid}`);
      fetchtask();
      handleDeleteConfirmationClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "800" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Assigned_by</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Message</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Mark As Read</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {task.map((task, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "700" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {task.assigned_by}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>{task.message}</TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {task.created_at}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                <Checkbox onClick={() => handleMarkAsRead(task)} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(task)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Edit task</h2>
          <Formik
            initialValues={{
              assigned: selectedTasks.assigned_by,
              message: selectedTasks.message,
            }}
            validationSchema={validationSchema}
            onSubmit={handleEdittask}
          >
            {({ errors, touched }) => (
              <Form>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <Field
                    as={TextField}
                    label="Assigned_by"
                    name="assigned"
                    fullWidth
                    error={errors.assigned && touched.assigned}
                    helperText={
                      errors.assigned && touched.assigned && errors.assigned
                    }
                  />
                  <Field
                    as={TextField}
                    label="Message"
                    name="message"
                    fullWidth
                    error={errors.message && touched.message}
                    helperText={
                      errors.message && touched.message && errors.message
                    }
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleEditModalClose}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeletetask} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openAddModal} onClose={handleAddModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Add New task</h2>
          <Formik
            initialValues={{
              assigned: "",
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddtask}
          >
            {({ errors, touched }) => (
              <Form>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <Field
                    as={TextField}
                    label="Assigned_by"
                    name="assigned"
                    fullWidth
                    error={errors.assigned && touched.assigned}
                    helperText={
                      errors.assigned && touched.assigned && errors.assigned
                    }
                  />
                  <Field
                    as={TextField}
                    label="Message"
                    name="message"
                    fullWidth
                    error={errors.message && touched.message}
                    helperText={
                      errors.message && touched.message && errors.message
                    }
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleEditModalClose}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleAddModalOpen}
        sx={{ marginTop: "20px" }}
      >
        Add New task
      </Button>
    </Box>
  );
};

export default TaskTable;
