import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField, Autocomplete } from "@mui/material";
import { handleError, handleSuccess } from "../../../utils";
import { Project, IUser } from "../../types";

interface EditProjectProps {
  managers: IUser[];
  open: boolean;
  onClose: () => void;
  project: Project | undefined;
  onProjectUpdate: (project: Project) => void;
}

const EditProjectModal: React.FC<EditProjectProps> = ({ managers, open, onClose, project, onProjectUpdate }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<IUser[]>([]);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDesc(project.desc);
      setDeadlineDate(new Date(project.deadline_date).toISOString().split("T")[0]);

      // Match selected managers by their IDs
      const currentManagers = managers.filter((mgr) => 
        mgr._id !== undefined && project.managerSet.includes(mgr._id)
      );
      
      setSelectedManagers(currentManagers);
    }
  }, [project, managers]);

  if (!project) return null; // Prevents rendering if no project is selected

  const handleSaveProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("No token found, authorization required.");
      return;
    }
  
    if (!title.trim()) {
      handleError("Project title is required.");
      return;
    }
  
    if (!desc.trim()) {
      handleError("Project description is required.");
      return;
    }
  
    if (!deadlineDate) {
      handleError("Deadline date is required.");
      return;
    }
  
    // ✅ Fix: Ensure _id is always a string
    const updatedManagerIds: string[] = selectedManagers
      .map((manager) => manager._id)
      .filter((id): id is string => Boolean(id));
  
    const updatedProject: Project = {
      ...project!,
      title,
      desc,
      deadline_date: new Date(deadlineDate),
      managerSet: updatedManagerIds, // ✅ Store selected managers as IDs
    };
  
    try {
      const response = await fetch(`http://localhost:8080/projects/updateProject?id=${project?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedProject),
      });
  
      const responseData = await response.json();
  
      if (response.ok && responseData.success) {
        onProjectUpdate({ ...project!, ...updatedProject });
        handleSuccess("Project updated successfully!");
        onClose();
      } else {
        handleError("Failed to update project: " + responseData.message);
      }
    } catch (error) {
      handleError("Error updating project: " + error);
    }
  };
  

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-project-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Edit Project</Typography>
        <TextField 
          label="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          fullWidth 
          required
          sx={{ mt: 2 }} 
        />
        <TextField 
          label="Description" 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          fullWidth 
          required
          multiline
          rows={3}
          sx={{ mt: 2 }} 
        />
        <TextField
          label="Deadline Date"
          type="date"
          fullWidth
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
        />

        {/* Multi-Select Dropdown for Managers */}
        <Autocomplete
          multiple
          options={managers}
          getOptionLabel={(option) => option.name}
          value={selectedManagers}
          onChange={(_, newValue) => setSelectedManagers(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Managers" />}
          sx={{ mt: 2 }}
        />

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveProject}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditProjectModal;
