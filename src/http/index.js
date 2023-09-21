const $host = 'http://localhost:3000/'

async function sendRequest(url, method = 'GET', body = null, headers = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch($host + url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Something went wrong');
    }

    return await response.json();
}


export const registration = async (email, password, role) => {
    const data = await sendRequest('api/user/registration', 'POST', {email, password, role});
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.token.split('-')[-1]);
    return data.token;
}

export const login = async (email, password) => {
    const data = await sendRequest('api/user/login', 'POST', {email, password});
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.token.split('-')[4]);
    return data.token;
}

export const check = async () => {
    try {
        const data = await sendRequest('api/user/auth', 'GET');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.token.split('-')[4]);
        return data.token;
    } catch (e) {
        console.log(e);
    }
}

export const getTasks = async (userEmail) => {
    const data = await sendRequest('api/tasks/getTasks', 'POST', {email: userEmail});
    return data;
}


export const uploadTasks = async (tasksData, userEmail) => {
    const data = await sendRequest('api/tasks/updateTasks', 'POST', {email: userEmail, tasksData});
    return data;
}


