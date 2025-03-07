import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Holiday } from '../types';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 130 },
  { field: 'date', headerName: 'Date', width: 130, valueGetter: (value, row) => new Date(row.date).getDate() },
  {
    field: 'month',
    headerName: 'Month',
    width: 90,
    valueGetter: (value, row) => new Date(row.date).toLocaleString('default', { month: 'long' })
  },
  {
    field: 'day',
    headerName: 'Day',
    width: 160,
    valueGetter: (value, row) => new Date(row.date).toLocaleString('default', { weekday: 'long' })
    ,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

interface HolidayTableProps {
    holidays: Holiday[]
}
const DataTable: React.FC<HolidayTableProps> = ({holidays}) => {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
        rows={holidays}
        columns={columns}
        getRowId={(row) => `${row.title}-${row.date}`} // Generates a unique id
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        />
    </Paper>
  );
}

export default DataTable;
