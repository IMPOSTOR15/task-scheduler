import React from 'react';
import AddTaskForm from '../components/addTaskFromComponents/addTaskForm'
import cl from '../components/AddTaskPageComponents/AddTaskPage.module.css'
const AddTaskPage = () => {
    return (
        <div className={cl.addTaskForm}>
            <AddTaskForm/>
        </div>
    );
};

export default AddTaskPage;