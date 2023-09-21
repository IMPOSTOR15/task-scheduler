import React from 'react';
import { useLocation } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
import LoginForm from '../components/AuthComponents/LoginForm';
import RegistrationForm from '../components/AuthComponents/RegistrationForm';

const LoginPage = () => {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE

    return (
        <div>
            {isLogin ? 
                <LoginForm/>
            :
                <RegistrationForm/>
            }   
        </div>
    );
};

export default LoginPage;