// src/pages/Dashboard.tsx
import React from 'react';
import ProjectBoard from '../../components/Projects/ProjectBoard';
import { Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box className="main-content" >
        <ProjectBoard />
    </Box>
  );
};

export default Dashboard;
