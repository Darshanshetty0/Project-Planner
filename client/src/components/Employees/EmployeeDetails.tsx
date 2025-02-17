import { useParams } from "react-router-dom";
import { useEmployee } from "../../components/Employees/EmployeeContext";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { Card, CardContent, Typography, IconButton, Stack, Divider, Chip, Button} from "@mui/material";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams();
  const { employees } = useEmployee();
  
  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (<div>
      <Card sx={{ p: 2, minWidth: '80vw', boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'row'}}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Employee with ID: {id} does not exist! 
          </Typography>
          <p>Please make sure that you have entered the right ID. There is also a possibility that the empployee with ID {id} isn't assigned to you</p>
        </Stack>
      </Card>
    </div>);
  }

  return (
    <Card sx={{ p: 2, minWidth: '80vw', boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" fontWeight={600}>
              {employee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {employee.id}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" size="small">
              <EditSharpIcon />
            </IconButton>
            <IconButton color="error" size="small">
              <DeleteSharpIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Stack direction='row' spacing={30}>
          <Typography variant="body2" color="text.secondary">
            <strong>Created By:</strong> {employee.created_by_manager_email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Created Date:</strong> {employee.created_date}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          <strong>Holiday Calendar:</strong> {employee.holiday_calendar}
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Stack direction='row' sx={{justifyContent:'space-between'}}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Managers:
          </Typography>
          <Button>
            +Add
          </Button>
        </Stack>
        {employee.manager_set.map((manager, index) => (
          <Chip key={index} label={manager.manager_email} sx={{marginRight:'10px'}}/>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmployeeDetails;
