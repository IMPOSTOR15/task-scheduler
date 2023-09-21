import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import cl from './TaskList.module.css'
import TaskElement from '../TaskElement/TaskElement';
import { TaskContext } from '../../../context/TaskContextProvider';
const TaskListColumn = () => {
    const { taskData, sortByTitle, sortByDate } = useContext(TaskContext);
    const [currentDateSort, setCurrentDateSort] = useState(null);
    const [currentTitleSort, setCurrentTitleSort] = useState(null);

    const sortTasksByDate = () => {
        setCurrentTitleSort(null)
        setCurrentDateSort(currentDateSort === 'desc' ? 'asc' : 'desc')
        sortByDate(currentDateSort);
    }

    const sortTasksByTitle= () => {
        setCurrentDateSort(null)
        setCurrentTitleSort(currentTitleSort === 'desc' ? 'asc' : 'desc')
        sortByTitle(currentTitleSort)
    }
    return (
        <div className={cl.taskList}>
            <div className={cl.taskList_sortRow}>
                <button
                    onClick={sortTasksByDate}
                    className={cl.taskList_sortBtn}
                >
                    По дате {currentDateSort && (currentDateSort === 'desc' ? <span>&#9650;</span> : <span>&#9660;</span>)}
                </button>
                <button
                    onClick={sortTasksByTitle}
                    className={cl.taskList_sortBtn}
                >
                    По названию {currentTitleSort && (currentTitleSort === 'desc' ? <span>&#9650;</span> : <span>&#9660;</span>)}
                </button>
            </div>
            {
                taskData.map((task, index) => 
                    <TaskElement
                        key={task.id}
                        index={index}
                    />
                )
            }
        </div>
    );
};

export default TaskListColumn;