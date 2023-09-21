// from src

let db;

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('my-database', 1);

        request.onupgradeneeded = function() {
            const db = request.result;
            if (!db.objectStoreNames.contains('tasks')) {
                db.createObjectStore('tasks', { keyPath: 'email' });
            }
            
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'email' });
            }
        };

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
};

function getRequestData(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            reject(new Error('Ошибка получения даных из БД'));
        };
    });
}


self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('api/user/registration')) {
        event.respondWith(registerUser(event.request));
    } else if (event.request.url.includes('api/user/login')) {
        event.respondWith(loginUser(event.request));
    } else if (event.request.url.includes('api/user/auth')) {
        event.respondWith(checkToken(event.request));
    } else if (event.request.url.includes('api/tasks/updateTasks')) {
        event.respondWith(updateTasksData(event.request));
    } else if (event.request.url.includes('api/tasks/getTasks')) {
        event.respondWith(loadTasksData(event.request));
    }
});

async function registerUser(request) {
    const userData = await request.json();

    if (!db) {
        db = await openDatabase();
    }

    const transaction = db.transaction(['users', 'tasks'], 'readwrite');
    const userStore = transaction.objectStore('users');
    const tasksStore = transaction.objectStore('tasks');
    const userRequest = userStore.get(userData.email);
    const user = await getRequestData(userRequest);

    if (user) {
        return new Response(JSON.stringify({
            message: "Пользователь уже зарегестрирован"
        }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    userStore.add(userData);
    tasksStore.add({email: userData.email, tasks: ''});

    return new Response(JSON.stringify({
        token: "fake-jwt-token-for-" + userData.email
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

  async function loginUser(request) {
    try {
        const { email, password } = await request.json();

        if (!db) {
            db = await openDatabase();
        }

        const transaction = db.transaction('users', 'readonly');
        const store = transaction.objectStore('users');
        const userRequest = store.get(email);
        
        const user = await getRequestData(userRequest);

        if (user && user.password === password) {
            return new Response(JSON.stringify({
                token: "fake-jwt-token-for-" + email
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({
                message: "Неверный логин или пароль"
            }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (e){
        console.log(e);
    }
}


function checkToken(request) {
    let token = ''
    try {
        token = request.headers.get('Authorization').replace('Bearer ', '');
    } catch (e) {
        return new Response(JSON.stringify({
            valid: false
        }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    

    if (token.startsWith("fake-jwt-token-for-")) {
        return new Response(JSON.stringify({
            token: token,
            valid: true
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        return new Response(JSON.stringify({
            error: "Invalid token"
        }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
}
async function updateTasksData(request) {
    try {
        let { email, tasksData } = await request.json();
        if (!db) {
            db = await openDatabase();
        }
        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');
        const currentUserTasks = (await getRequestData(store.get(email))) || {tasks: []};
        const userCreatedTasks = tasksData.filter(task => task.createBy === email);
        currentUserTasks.tasks = userCreatedTasks;
        store.put({email: email, tasks: currentUserTasks.tasks});

        for (const task of tasksData) {
            if (task.createBy !== email) {
                const otherUserTasks = (await getRequestData(store.get(task.createBy))) || {tasks: []};
                const existingTaskIndex = otherUserTasks.tasks.findIndex(t => t.id === task.id);
                
                if (existingTaskIndex !== -1) {
                    otherUserTasks.tasks[existingTaskIndex] = task;
                } else {
                    otherUserTasks.tasks.push(task);
                }

                store.put({email: task.createBy, tasks: otherUserTasks.tasks});
            }
        }

        return new Response(JSON.stringify({
            message: "Данные загружены"
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e) {
        console.log(e);
    }
}



async function loadTasksData(request) {
    try {
        const { email } = await request.json();
        if (!db) {
            db = await openDatabase();
        }

        const transaction = db.transaction('tasks', 'readonly');
        const store = transaction.objectStore('tasks');
        
        let userTasks = [];
        const tasksRequest = store.get(email);
        
        const userTaskData = await getRequestData(tasksRequest);
        if (userTaskData) {
            userTasks = [...userTaskData.tasks];
        }

        const getAllCursorRequest = store.openCursor();

        getAllCursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const taskData = cursor.value;
                if (taskData.tasks) {
                    taskData.tasks.forEach(task => {
                        if (task.allowToUsers && task.allowToUsers.includes(email)) {
                            userTasks.push(task);
                        }
                    });
                }
                
                cursor.continue();
            }
        };

        await new Promise((resolve, reject) => {
            transaction.oncomplete = resolve;
            transaction.onerror = reject;
        });

        return new Response(JSON.stringify({
            tasks: userTasks
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e) {
        console.log(e);
    }
}





