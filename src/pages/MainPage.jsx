import React, { useContext } from 'react';
import Header from '../components/Header/Header.jsx';
import { Context } from '../index.js';
import cl from '../components/MainPageComponents/MainPage.module.css'
import TaskListColumn from '../components/MainPageComponents/TaskList/TaskListColumn.jsx';
const MainPage = () => {
    const {user} = useContext(Context)
    return (
        <>
        {user.isAuth ?
            <div>
                <h1 className={cl.mainPage__title}>Список задач</h1>
                <TaskListColumn/>
            </div>
            :
            <h1 className={cl.mainPage__title}>Необходимо войти, чтобы пользоваться планировщиком</h1>
        }
        </>
    );
};

export default MainPage;