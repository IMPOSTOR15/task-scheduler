import { getTasks, uploadTasks } from "../http"

export default class TaskStore {
    constructor() {
        this._taskData = []
    }
    
    setTaskList(taskData, email) {
        this._taskData = taskData
        this.saveTasksToDB(this._taskData, email)
    }
    addTask(task, email) {
        this._taskData.push(task)
        this.saveTasksToDB(this._taskData, email)
    }
    editTask(taskIndex, task, email) {
        this._taskData[taskIndex] = task
        this.saveTasksToDB(this._taskData, email)
    }
    sortByDate(order) {
        this._taskData = this._taskData.sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
        
            if (order === 'desc') {
              return dateB - dateA;
            } else {
              return dateA - dateB;
            }
        });
        return this._taskData
    }

    sortByTitle(order) {
        this._taskData = this._taskData.sort((a, b) => {
            if (order === 'desc') {
                return b.title.localeCompare(a.title);
            } else {
                return a.title.localeCompare(b.title);
            }
        });
        return this._taskData;
    }


    async saveTasksToDB(tasks, email) {
        
        await uploadTasks(tasks, email)
    }
    async loadTasks (email) {
        const data = await getTasks(email)
        this._taskData = data.tasks;
    }
    get taskData() {
        return this._taskData
    }
}