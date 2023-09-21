import React, { useCallback, useContext, useState } from 'react';
import cl from './TaskElement.module.css'
import { Context } from '../../..';
import TaskElementEditModal from '../TaskElementEditModal/TaskElementEditModal';
import { TaskContext } from '../../../context/TaskContextProvider';

const TaskElement = ({index}) => {
    const { user } = useContext(Context);
    const { taskData, setTaskList } = useContext(TaskContext);

    const [isComplete, setIsComplete] = useState(taskData[index].isComplete);
    const [completeBefore, setCompleteBefore] = useState(taskData[index].completeDate);
    const [completeAt, setCompleteAt] = useState(taskData[index].completeAt);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const uncompleteTask = useCallback(() => {
        const updatedTasks = [...taskData];
        updatedTasks[index].isComplete = false;
        updatedTasks[index].completeAt = null;

        setTaskList(updatedTasks);
        setIsComplete(false);
        setCompleteAt(null);
    }, [taskData, setTaskList, index]);

    const completeTask = useCallback(() => {
        const updatedTasks = [...taskData];
        updatedTasks[index].isComplete = true;
        updatedTasks[index].completeAt = Date.now();

        setTaskList(updatedTasks);
        setIsComplete(true);
        setCompleteAt(Date.now());
    }, [taskData, setTaskList, index]);

    const deleteTask = useCallback(() => {
        const updatedTasks = taskData.filter((_, taskIndex) => taskIndex !== index);
        setTaskList(updatedTasks);
    }, [taskData, setTaskList, index]);

    return (
        <>
            <div className={`${cl.task} ${isComplete ? cl.task_complete : ''}`}>
                <div className={cl.task__header}>
                    <h3 className={cl.task__title}>{taskData[index].title}</h3>
                    <span className={cl.task__createDate}>Дата создания: {new Date(taskData[index].createDate).toLocaleDateString('ru-RU')}</span>
                    {isComplete ?
                        <span className={cl.task__completeDate}>Выполненно: {new Date(completeAt).toLocaleDateString('ru-RU')}</span>
                    :
                        <span className={cl.task__completeDate}>Нужно выполнить до: {new Date(completeBefore).toLocaleDateString('ru-RU')} {new Date(completeBefore).toLocaleTimeString('ru-RU').slice(0, -3)}</span>
                    }                
                </div>
                <div className={cl.task__body}>
                    <span className={cl.task__description}>Описание задачи</span>
                    <p>{taskData[index].description}</p>
                    {taskData[index].createBy !== user.email &&
                        <p>Автор: {taskData[index].createBy}</p>
                    }
                    
                </div>
                <div className={cl.task__footer}>
                    <button className={cl.task__editBtn} onClick={() => {setIsEditModalOpen(true)}}>Редактировать</button>
                    {isComplete ?
                        <button className={cl.task__uncompleteBtn} onClick={uncompleteTask}></button>
                        :
                        <button className={cl.task__completeBtn} onClick={completeTask}></button>
                    }
                    <button className={cl.task__deleteBtn} onClick={deleteTask}></button>
                </div>
            </div>
            {isEditModalOpen ?
                <TaskElementEditModal taskIndex={index} setIsOpen={setIsEditModalOpen}/>
                :
                null
            }
        </>
    );
};

export default TaskElement;