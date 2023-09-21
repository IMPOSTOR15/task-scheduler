import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/normalize.css'
import './assets/styles/index.css';
import App from './App';
import UserStore from './store/UserStore';
import TaskStore from './store/TaskStore';
import { TaskContextProvider } from './context/TaskContextProvider';
export const Context = createContext(null)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: new UserStore(),
  }}>
    <TaskContextProvider>
      <App />
    </TaskContextProvider>
    
  </Context.Provider>
);
