import React, { useContext, useState } from 'react';
import cl from './LoginForm.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { HOME_ROUTE } from '../../utils/consts';
import { Context } from '../..';
import { login } from '../../http';
import Alert from '../Alert/Alert';
import { TaskContext } from '../../context/TaskContextProvider';

const LoginForm = () => {
    const {user} = useContext(Context)
    const { loadTasks } = useContext(TaskContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [valid, setValid] = useState(true);
    const [errorText, setErrorText] = useState('');

    const handleChange = (event, setStateFunction, validationFunction = null) => {
        const value = event.target.value;
        setStateFunction(value);
        if (validationFunction) {
            setValid(validationFunction(value));
        }
    };

    const validateEmail = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    const userLogin = async (event) => {
        event.preventDefault();
        try {
            if (validateEmail(email)) {
                let data = await login(email, password);
                if (data) {
                    let userEmail = data.split('-')[4];
                    user.setUser(data);
                    user.setUserEmail(userEmail);
                    user.setIsAuth(true);
                    await loadTasks(userEmail);
                    navigate(HOME_ROUTE);
                } else {
                    setErrorText('Пользователь не найден');
                }
            } else {
                setValid(false);
            }
        } catch (e) {
            setErrorText(e.message);
        }
    };

    return (
    <>
        <Alert alertText={errorText} setAlertText={setErrorText} type='error' />
            <form className={cl.loginForm} onSubmit={userLogin}>
            <h2>Вход в профиль</h2>
            <div className={cl.textField}>
                <label
                    className={cl.textField__label}
                >
                    E-mail
                </label>
                <input
                    className={cl.textField__input}
                    type='text'
                    name="email"
                    autoComplete="on"
                    value={email}
                    placeholder='Введите e-mail'
                    onChange={e => handleChange(e, setEmail, validateEmail)}
                />
                { <p className={cl.errorText} style={!valid ? { color: 'rgb(255, 113, 113)' } : {opacity: 0}}>Введите корректный адрес электронной почты</p>}
            </div>
            <div className={cl.textField} style={{marginBottom: '10px'}}>
                <label
                    className={cl.textField__label}
                >
                    Пароль
                </label>
                <input
                    className={cl.textField__input}
                    type='password'
                    autoComplete="on"
                    value={password}
                    name="password"
                    placeholder='Введите пароль'
                    onChange={e => handleChange(e, setPassword)}
                />
            </div>
            <p className={cl.registrationText}>Нет аккаунта? <NavLink className={cl.registrationLink} to={'/registration'}>Регистрация</NavLink></p>
            
            <button type='submit' className={cl.LoginButton} >ВОЙТИ</button>
        </form>
    </>
        
    );
};

export default LoginForm;