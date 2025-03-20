import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Holiday } from '../types';

interface HolidayTableProps {
  holidays: Holiday[];
  onDelete: (holidayId: string) => void;
}

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 130 },
  {
    field: 'date',
    headerName: 'Date',
    width: 130,
    valueGetter: (value, row) => new Date(row.date).getDate(),
  },
  {
    field: 'month',
    headerName: 'Month',
    width: 90,
    valueGetter: (value, row) =>
      new Date(row.date).toLocaleString('default', { month: 'long' }),
  },
  {
    field: 'day',
    headerName: 'Day',
    width: 160,
    valueGetter: (value, row) =>
      new Date(row.date).toLocaleString('default', { weekday: 'long' }),
  },
  {
    field: 'delete',
    headerName: 'Actions',
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <IconButton onClick={() => params.api.getRow(params.id)?.onDelete(params.id)} color="error">
        <DeleteIcon />
      </IconButton>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const DataTable: React.FC<HolidayTableProps> = ({ holidays, onDelete }) => {
  const modifiedRows = holidays.map((holiday) => ({
    ...holiday,
    id: `${holiday.title}-${holiday.date}`, // Unique ID
    onDelete, // Pass onDelete function so it can be accessed in renderCell
  }));

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={modifiedRows}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default DataTable;
