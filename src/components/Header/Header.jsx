import React, { useContext } from 'react';
import cl from './Header.module.css'
import { Context } from '../..';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADDTASK_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from '../../utils/consts';

const Header = () => {
  
  const location = useLocation()
  const isAddForm = location.pathname === ADDTASK_ROUTE
  const {user} = useContext(Context)
  let navigate = useNavigate();
  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    user.setUserEmail('')
    navigate(LOGIN_ROUTE)
  }

  return (
    <header className={cl.header}>
      <h1 className={cl.header__title} onClick={()=> navigate(HOME_ROUTE)}>Плаинровщик задач</h1>
      <div className={cl.header__buttons}>
        {user.isAuth ?
          <>
            {isAddForm ?
              <button className={cl.header__button} onClick={()=> navigate(HOME_ROUTE)}>Перейти к задачам</button>
              :
              <button className={cl.header__button} onClick={()=> navigate(ADDTASK_ROUTE)}>Добавить задачу</button>
            }
            
            <button className={cl.header__button} onClick={() => logOut()}>Выйти</button>
          </>
          :
          <button className={cl.header__button} onClick={()=> navigate(LOGIN_ROUTE)} >Войти</button>
        }
      </div>
    </header>
  );
};

export default Header;