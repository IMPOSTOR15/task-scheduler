import React, { useContext, useState } from 'react';
import cl from './TaskElementEditModal.module.css'
import { Context } from '../../..';
import Alert from '../../Alert/Alert';
import { TaskContext } from '../../../context/TaskContextProvider';
const TaskElementEditModal = ({taskIndex, setIsOpen}) => {
    const [alertText, setAlertText] = useState('')
    const {user} = useContext(Context);
    const { taskData, editTask } = useContext(TaskContext);
    const [taskTitle, setTaskTitle] = useState(taskData[taskIndex].title);
    const [taskDescription, setTaskDescription] = useState(taskData[taskIndex].description);
    const [taskCompleteDate, setTaskCompleteDate] = useState(taskData[taskIndex].completeDate.split('T')[0]);
    const [taskCompleteTime, setTaskCompleteTime] = useState(taskData[taskIndex].completeDate.split('T')[1].split('.')[0].slice(0, -3));
    const [allowUser, setAllowUser] = useState('');
    const [taskUsersAlow, setTaskUsersAlow] = useState(taskData[taskIndex].allowToUsers)

    const editTaskData = (e) => {
        e.preventDefault()
        const taskValues = {
            id: taskData[taskIndex].id,
            title: taskTitle,
            description: taskDescription,
            completeDate: `${taskCompleteDate}T${taskCompleteTime}:00.000Z`,
            createDate: new Date().toISOString(),
            isComplete: false,
            allowToUsers: taskUsersAlow,
            createBy: taskData[taskIndex].createBy
        }

        editTask(taskIndex, taskValues, user.email)
        setAlertText('Задача обновлена')
        setIsOpen(false)
    }
    const validateEmail = (input) => {
        if(!input) return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input);
        return isValid
    };

    const addUserAllow = (e) => {
        e.preventDefault()
        if (!allowUser) return setAlertText('Введите email пользователя')
        if (!validateEmail(allowUser)) return setAlertText('email введен некорректно')
        if (taskUsersAlow.includes(allowUser)) return setAlertText('пользователь уже добавлен')
        setTaskUsersAlow([...taskUsersAlow, allowUser])
        setAllowUser('')
    }

    const deleteUserFromList = (e, index) => {
        e.preventDefault()
        taskUsersAlow.splice(index, 1)
        setTaskUsersAlow([...taskUsersAlow])
    }

    return (
        <>
            <Alert alertText={alertText} setAlertText={setAlertText} type='notify'/>
            <div className={cl.modal}>
                <div className={cl.modal__content}>
                    <div className={cl.modal__header}>
                        <h3 className={cl.modal__title}>Редактировать задачу</h3>
                        <button className={cl.modal__closeBtn} onClick={() => setIsOpen(false)}/>
                    </div>
                    <div className={cl.modal__body}>
                    <form className={cl.editTask} onSubmit={editTaskData}>
                        <label className={cl.editTask__inputWrapper} htmlFor="taskTitleInput">
                            <span>Заголовок задачи</span>
                            <input
                                className={cl.editTask__input}
                                type="text"
                                name='taskTitleInput'
                                value={taskTitle}
                                onChange={e => setTaskTitle(e.target.value)}
                            />
                        </label>
                        <label className={cl.editTask__inputWrapper} htmlFor="taskDescriptionInput">
                            <span>Описание задачи</span>
                            <textarea
                                className={cl.editTask__textarea}
                                type="text"
                                name='taskDescriptionInput'
                                value={taskDescription}
                                onChange={e => setTaskDescription(e.target.value)}
                            />
                        </label>
                        <label className={cl.editTask__inputWrapper} htmlFor="taskCompleteTime">
                            <span>Время выполнения задачи</span>
                            <input
                                className={cl.editTask__input}
                                type="time"
                                name='taskCompleteTime'
                                value={taskCompleteTime}
                                onChange={e => setTaskCompleteTime(e.target.value)}
                            />
                        </label>
                        <label className={cl.editTask__inputWrapper} htmlFor="taskCompleteDate">
                            <span>Дата выполнения задачи</span>
                            <input
                                className={cl.editTask__input}
                                type="date"
                                name='taskCompleteDate'
                                value={taskCompleteDate}
                                onChange={e => {setTaskCompleteDate(e.target.value)}}
                            />
                        </label>
                        <label className={cl.editTask__inputWrapper} htmlFor="taskCompleteDate">
                            <span>Поделиться с пользователями</span>
                            <input
                                className={cl.editTask__input}
                                type="email"
                                placeholder='Введите e-mail пользователя'
                                name='taskCompleteDate'
                                value={allowUser}
                                onChange={e => setAllowUser(e.target.value)}
                            />
                            <button className={cl.editTask__button} onClick={addUserAllow}>Поделиться с пользователем</button>
                            
                        </label>
                        {(taskUsersAlow.length > 0) ?
                            <>
                                <span>Список пользователей</span>
                                <ul className={cl.allowUserList}>
                                    {
                                        taskUsersAlow.map((userEmail, index) =>
                                            <li key={index} className={cl.allowUserList_user}>
                                                <span>{userEmail}</span>
                                                <button className={cl.allowUserList__deleteUserBtn} onClick={(e) => deleteUserFromList(e, index)}></button>
                                            </li>
                                        )
                                    }
                                </ul>
                            </>
                            : null
                        }

                        <button className={cl.editTask__button} type='submit'>ИЗМЕНИТЬ</button>

                    </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskElementEditModal;