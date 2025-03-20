import { useState } from "react";
import { TextField, Button, Typography, Box, Autocomplete, Chip } from "@mui/material";
import { Project, IUser } from "../types";
import { handleError, handleSuccess } from "../../utils";

interface AddProjectProps {
  managers: IUser[];
  onProjectAdd: (project: Project) => void;
}

const AddProject: React.FC<AddProjectProps> = ({ managers, onProjectAdd }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [deadlineDate, setDeadlineDate] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<IUser[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      handleError("User not authenticated.");
      return;
    }

    if (!title.trim() || !deadlineDate) {
      handleError("Title and Deadline are required.");
      return;
    }

    const managerIds = selectedManagers.map((m) => m._id).filter((id): id is string => Boolean(id));

    const newProject: Omit<Project, "id"> = {
      title,
      desc,
      created_date: new Date(createdDate),
      deadline_date: new Date(deadlineDate),
      tasksSet: [],
      employeeSet: [],
      managerSet: managerIds, // ✅ Send only IDs
    };

    try {
      const response = await fetch("http://localhost:8080/projects/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        onProjectAdd({ ...newProject, id: data.id }); // ✅ Add the returned ID from MongoDB
        handleSuccess("Project added successfully!");
        setMessage("Successfully created project");

        // ✅ Reset form fields
        setTitle("");
        setDesc("");
        setCreatedDate(new Date().toISOString().split("T")[0]);
        setDeadlineDate("");
        setSelectedManagers([]);
      } else {
        setError(data.message || "Failed to add project");
        handleError(data.message || "Failed to add project");
      }
    } catch (error: unknown) {
      console.error("Error adding project:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      handleError(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, padding: 3, backgroundColor: "white" }}>
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

        {/* Multi-Select Dropdown for Managers */}
        <Autocomplete
          multiple
          options={managers}
          getOptionLabel={(option) => option.name}
          value={selectedManagers}
          onChange={(_, newValue) => setSelectedManagers(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option.name} {...getTagProps({ index })} /> // ✅ Remove key={option._id}
            ))
          }
          renderInput={(params) => <TextField {...params} label="Select Managers" />}
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Project
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
