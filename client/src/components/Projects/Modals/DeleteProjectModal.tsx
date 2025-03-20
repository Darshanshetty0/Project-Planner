import { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { handleError, handleSuccess } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Project } from "../../types";

interface DeleteProjectProps {
  open: boolean;
  onClose: () => void;
  project: Project | undefined;
  onProjectDelete: (id: string) => void;
}

const DeleteProjectModal: React.FC<DeleteProjectProps> = ({ open, onClose, project, onProjectDelete }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const navigate = useNavigate();

  if (!project) return null; // Prevents rendering if no project is selected

  const handleDeleteProject = async () => {
    if (confirmationText !== project.title) {
      handleError("Project title does not match. Please type the correct title to confirm deletion.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authorization required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/projects/deleteProject?id=${project.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        if (project.id) {
          onProjectDelete(project.id); // ✅ Calls only if `id` is defined
        } else {
          console.error("Project ID is undefined, cannot delete.");
        }
        onClose();
        navigate("/home/projects");
        handleSuccess("Project deleted successfully!");
      } else {
        handleError("Failed to delete project: " + responseData.message);
      }
    } catch (error) {
      handleError("Error deleting project: " + error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="delete-project-modal">
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
        <Typography variant="h6" color="error">Confirm Project Deletion</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          To confirm deletion, type <strong>{project.title}</strong> in the box below:
        </Typography>
        <TextField
          label="Confirm Title"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleDeleteProject}
          disabled={confirmationText !== project.title}
        >
          Delete Project
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteProjectModal;
