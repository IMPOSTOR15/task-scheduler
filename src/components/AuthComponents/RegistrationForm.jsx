import React, { useContext,  useState } from 'react';
import cl from './RegistrationForm.module.css'
import Alert from '../Alert/Alert'
import { NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { HOME_ROUTE } from '../../utils/consts';
import { registration } from '../../http';
import { TaskContext } from '../../context/TaskContextProvider';

const RegistrationForm = () => {
    const { user } = useContext(Context)
    const { loadTasks } = useContext(TaskContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmedPassword: ''
    });

    const [errorText, setErrorText] = useState('');
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateEmail = (input) => {
        if(!input) return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input);
        return isValid
    };

    const validatePassword = (input) => {
        if(!input) return false
        const isValid = input.length >= 8;
        return isValid
    };

    const registerUser = async (email, password) => {
        const data = await registration(email, password, 'user');
        let userEmail = data.split('-')[4]
        user.setUser(data);
        user.setIsAuth(true);
        user.setUserEmail(userEmail)
        await loadTasks(userEmail);
        navigate(HOME_ROUTE);
    };
      
    const submit = async (event) => {
        event.preventDefault();
        try {
            if (formData.password !== formData.confirmedPassword) {
                setErrorText("Пароли не совпадают");
                return;
            }
            if (!validatePassword(formData.password)) {
                setErrorText("Пароль должен быть длиннее 8 символов");
                return;
            }
            if (!validateEmail(formData.email)) {
                setErrorText("Введите корректный email");
                return;
            }
            await registerUser(formData.email, formData.password);
        } catch (e) {
            e.message ? setErrorText(e.message) : setErrorText("Ошибка регистрации")
            console.log(e);
        }
    };
    return (
        <>
            <Alert alertText={errorText} setAlertText={setErrorText} type={'error'}></Alert>
            <form className={cl.loginForm} onSubmit={submit}>
                <h2>Регистрация пользователя</h2>
                <div className={cl.textField}>
                    <label
                        className={cl.textField__label}
                    >
                        E-mail
                    </label>
                    <input
                        className={cl.textField__input}
                        type='email'
                        autoComplete="on"
                        name="email"
                        value={formData.email}
                        placeholder='Введите e-mail'
                        onChange={handleChange}
                    />
                </div>
                <div className={cl.textField}>
                    <label
                        className={cl.textField__label}
                    >
                        Пароль
                    </label>
                    <input
                        className={cl.textField__input}
                        type='password'
                        autoComplete="on"
                        value={formData.password}
                        name="password"
                        placeholder='Введите пароль'
                        onChange={handleChange}
                    />
                </div>
                <div className={cl.textField}>
                    <label
                        className={cl.textField__label}
                    >
                        Повтоирте пароль
                    </label>
                    <input
                        className={cl.textField__input}
                        type='password'
                        autoComplete="on"
                        value={formData.confirmedPassword}
                        name="confirmedPassword"
                        placeholder='Повторите пароль'
                        onChange={handleChange}
                    />
                </div>
                {formData.password !== formData.confirmedPassword ? 
                    <p className={cl.errorText}>Пароли не совпадают</p>
                    :
                    <div></div>
                }
                <p className={cl.registrationText}>Есть аккаунт? <NavLink className={cl.registrationLink} to={'/login'}>Войти</NavLink></p>
                
                <button 
                    
                    className={cl.LoginButton}
                >
                    РЕГИСТРАЦИЯ
                </button>
            </form>
        </>
    );
};

export default RegistrationForm;