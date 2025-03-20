import mongoose, { Schema, Document } from 'mongoose';

export interface Employee extends Document {
    name: String;
    created_by_manager: IUser; //check if exists //shouldnt be deletable
    created_date: Date;
    holiday_calendar: Calendar; //check if exists
    manager_set: IUser[]; //check if already exists in the list, if yes-> error
    shift_from: String;
    shift_to: String;
}

export interface Holiday extends Document {
    title: string;
    date: Date;
}

export interface Calendar extends Document {
    title: string;
    created_by_manager: IUser;
    year: number;
    holidays: Holiday[]; 
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

export interface Task extends Document {
    id : string,
    title : string,
    desc : string,
    hrs_alloted : string,
    created_date: Date,
    deadline_date: Date,
    isDone: boolean,
    working_employ_id :Employee[],
}

export interface Project extends Document {
    title: string;
    desc: string;
    created_date: Date;
    deadline_date: Date;
    created_by_manager: IUser;
    tasksSet: Task[];
    employeeSet:Employee[];
    managerSet:IUser[]; 
}