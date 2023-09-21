import React, { useContext, useState, useCallback } from 'react';
import cl from './addTaskForm.module.css';
import { Context } from '../..';
import Alert from '../Alert/Alert';
import { TaskContext } from '../../context/TaskContextProvider';

const AddTaskForm = () => {
    const { user } = useContext(Context);
    const { addTask } = useContext(TaskContext);
    
    const [task, setTask] = useState({
        title: '',
        description: '',
        completeDate: new Date().toISOString().split('T')[0],
        completeTime: new Date().toISOString().split('T')[1].slice(0,5)
    });

    const [alert, setAlert] = useState({
        text: '',
        type: 'error'
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    }, []);

    const addTaskToTaskList = useCallback((e) => {
        e.preventDefault();

        if (!task.title || !task.completeDate || !task.completeTime) {
            setAlert({ text: 'Заполните обязательные поля', type: 'error' });
            return;
        }

        const taskValues = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            title: task.title,
            description: task.description,
            completeDate: `${task.completeDate}T${task.completeTime}:00.000Z`,
            createDate: new Date().toISOString(),
            isComplete: false,
            allowToUsers: [],
            createBy: user.email
        };

        addTask(taskValues);
        setAlert({ text: 'Задача успешно добавлена', type: 'notify' });

        setTask(prev => ({ ...prev, title: '', description: '' }));
    }, [task, addTask, user.email]);

    return (
        <>
            <Alert alertText={alert.text} setAlertText={setAlert} type={alert.type} />
            <form className={cl.addTask} onSubmit={addTaskToTaskList}>
                <h3 className={cl.addTask__title}>Добавить новую задачу</h3>
                <label className={cl.addTask__inputWrapper} htmlFor="taskTitleInput">
                    <span>Заголовок задачи</span>
                    <input
                        className={cl.addTask__input}
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleInputChange}
                    />
                </label>
                <label className={cl.addTask__inputWrapper} htmlFor="taskDescriptionInput">
                    <span>Описание задачи</span>
                    <textarea
                        className={cl.addTask__textarea}
                        type="text"
                        name="description"
                        value={task.description}
                        onChange={handleInputChange}
                    />
                </label>
                <label className={cl.addTask__inputWrapper} htmlFor="taskCompleteTime">
                    <span>Время выполнения задачи</span>
                    <input
                        className={cl.addTask__input}
                        type="time"
                        name="completeTime"
                        value={task.completeTime}
                        onChange={handleInputChange}
                    />
                </label>
                <label className={cl.addTask__inputWrapper} htmlFor="taskCompleteDate">
                    <span>Дата выполнения задачи</span>
                    <input
                        className={cl.addTask__input}
                        type="date"
                        name="completeDate"
                        value={task.completeDate}
                        onChange={handleInputChange}
                    />
                </label>
                <button className={cl.addTask__button} type='submit'>ДОБАВИТЬ</button>
            </form>
        </>
    );
};

export default React.memo(AddTaskForm);