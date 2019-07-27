class UserDao {
    constructor(connection) {
        this._connection = connection;
    }

    getUser(user_id) {
        this._connection.query('SELECT * FROM userml WHERE user_id = ?', [user_id],
            (err, user, fields) => {
                return Promise.resolve(user);
            })
    }

}

module.exports = UserDao;