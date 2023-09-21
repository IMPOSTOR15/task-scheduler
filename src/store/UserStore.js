
export default class UserStore {
    constructor() {
        this._isAuth = false
        this._userToken = {}
        this._userEmail = {}
        this._userData = {}
    }

    setIsAuth(bool) {
        localStorage.setItem('isAuth', true)
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setUserData(user_data) {
        this._userData = user_data
    }
    setUserEmail(email) {
        this._userEmail = email
    }

    get userData() {
        return this._userData
    }
    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get email() {
        return this._userEmail
    }
}