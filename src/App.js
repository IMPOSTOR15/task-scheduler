import { useContext, useEffect, useState } from "react";
import AppRouter from "./components/AppRouter.jsx";
import { Context } from "./index.js";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import { check } from "./http/index.js";
import { TaskContext } from "./context/TaskContextProvider.jsx";

function App() {
    const {user} = useContext(Context)
    const { loadTasks } = useContext(TaskContext);
    const [loading, setLoading] = useState(true)

    Notification.requestPermission();

    useEffect(() => {
        async function checkAndLoadData() {
            try {
                const data = await check();
            if (data) {
                let email = data.split('-')[4]
                user.setUserEmail(email);
                user.setIsAuth(true);
                loadTasks(email)
            }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setLoading(false);
            }
        }
        checkAndLoadData();
    }, []);

    return (
        <div className="App">
        {!loading ?
            <BrowserRouter>
                <Header/>
                <AppRouter/>
            </BrowserRouter>
            :
            ''
        }
        </div>
    );
}

export default App;
