import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useProjects } from "../../components/Projects/ProjectContext";
import { handleError, handleSuccess } from "../../utils";
import { Project } from "../types";

const AddProject: React.FC = () => {
  const { addProject } = useProjects();

  // Form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const newProject: Project = {
      title,
      desc,
      created_date: new Date(createdDate),
      deadline_date: new Date(deadlineDate),
      id,
      tasksSet: [],
      employeeSet: [],
      managerSet: [],
    };

    try {
      const response = await fetch("http://localhost:8080/projects/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        addProject(newProject);
        handleSuccess("Project added successfully!");
        setMessage("Successfully created project");

        // Reset form fields
        setTitle("");
        setDesc("");
        setCreatedDate("");
        setDeadlineDate("");
        setId("");
      } else {
        setError(data.message || "Failed to add project");
        handleError(data.message || "Failed to add project");
      }
    } catch (error: unknown) {
      console.error("Error adding project:", error);

      if (error instanceof Error) {
        setError(error.message);
        handleError(error.message);
      } else {
        setError("An unexpected error occurred.");
        handleError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Created Date"
          variant="outlined"
          fullWidth
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Deadline Date"
          variant="outlined"
          fullWidth
          type="date"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add
        </Button>
      </form>
      {message && (
        <Typography variant="body2" color="success.main" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error.main" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AddProject;