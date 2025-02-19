import ViewProject from './ViewProject';        
import { Container, Box} from '@mui/material';     
import AddProject from './AddProject';
        
const ProjectAddView = () => {
    return (
    <Container sx={{display:"flex", flexDirection:"row"}}>
        <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
            <ViewProject />
        </Box>
        <Box className="main-content" sx={{maxWidth: 400,maxHeight:"fit-content"}}>
            <AddProject />
        </Box>
    </Container>
    );
  };
  
export default ProjectAddView;
        