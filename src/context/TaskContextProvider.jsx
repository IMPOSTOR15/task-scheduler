// TaskContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Context } from '..';
import { getTasks, uploadTasks } from '../http';

export const TaskContext = createContext();

export function TaskContextProvider({ children }) {
    const [taskData, setTaskData] = useState([]);
    const {user} = useContext(Context)

    const setTaskList = async (tasks) => {
        setTaskData(tasks);
        await uploadTasks(tasks, user.email);
    };

    const addTask = async (task) => {
        const newTaskData = [...taskData, task];
        setTaskData(newTaskData);
        await uploadTasks(newTaskData, user.email);
    };

    const editTask = async (taskIndex, task) => {
        const newTaskData = [...taskData];
        newTaskData[taskIndex] = task;
        setTaskData(newTaskData);
        await uploadTasks(newTaskData, user.email);
    };

    const sortByDate = (order) => {
        setTaskData(taskData.sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
        
            if (order === 'desc') {
              return dateB - dateA;
            } else {
              return dateA - dateB;
            }
        }))
    }

    const sortByTitle = (order) => {
        setTaskData(taskData.sort((a, b) => {
            if (order === 'desc') {
                return b.title.localeCompare(a.title);
            } else {
                return a.title.localeCompare(b.title);
            }
        }))
    }

    const loadTasks = async (email) => {
        const data = await getTasks(email)
        setTaskData(data.tasks);
    }

    useEffect(() => {
        const timers = [];
        taskData.forEach(task => {
            const now = Date.now();
            const completeDate = new Date(task.completeDate).getTime();
            const timeLeft = completeDate - now;

            if (timeLeft > 600000) {
                const timer = setTimeout(() => {
                    sendTaskNotification(task, 10);
                }, timeLeft - 600000);
    
                timers.push(timer);
            }
        });
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [taskData]);

    const sendTaskNotification = (task, remaintime) => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification(task, remaintime);
                }
            });
        } else {
            showNotification(task, remaintime);
        }
    }
    
    const showNotification = (task, remaintime) => {
        new Notification('Предупреждение о сроке выполнения!', {
            body: `У задачи "${task.title}" ${remaintime} минут до дедлайна!`,
        });
    }


    return (
        <TaskContext.Provider value={{ taskData, setTaskList, addTask, editTask, sortByDate, sortByTitle, loadTasks}}>
            {children}
        </TaskContext.Provider>
    );
}
