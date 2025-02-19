import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './models/db'; 
import AuthRouter from './routes/authRouter';  
import ProductRouter from './routes/productRouter';  
import CalendarRouter from './routes/calendarRoutes'; 
import HomeRouter from './routes/homeRouter'; 
import EmployeeRouter from './routes/employeeRouter'; 
import ProjectRouter from './routes/projectRouter'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
connect();

// Allow CORS and JSON-formatted returns
app.use(bodyParser.json());
app.use(cors());

// Define application routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/projects',ProjectRouter);
app.use('/home', HomeRouter);
app.use('/calendar', CalendarRouter);
app.use('/employees', EmployeeRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}!`));
