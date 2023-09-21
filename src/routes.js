import AddTaskPage from "./pages/AddTaskPage"
import LoginPage from "./pages/LoginPage"
import MainPage from "./pages/MainPage"
import { ADDTASK_ROUTE, HOME_ROUTE,
        LOGIN_ROUTE,
        REGISTRATION_ROUTE
    } from "./utils/consts"

export const authRoutes = [
    // {
    //     path: HOME_ROUTE,
    //     component: <MainPage/>
    // },
    {
        path: ADDTASK_ROUTE,
        component: <AddTaskPage/>
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        component: <LoginPage/>
    },
    {
        path: REGISTRATION_ROUTE,
        component: <LoginPage/>
    },
    {
        path: HOME_ROUTE,
        component: <MainPage/>
    },

]