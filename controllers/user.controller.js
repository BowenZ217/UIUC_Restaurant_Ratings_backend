
const fs = require('fs');

let userData = null;
const userDataPath = 'data/user_data.json';

fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    userData = JSON.parse(data);
});

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 在 userData 中查找匹配的邮箱
    const user = userData.find((u) => u.email === email);

    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    // 检查密码是否匹配
    if (user.password !== password) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    // 返回用户信息（不包括密码）
    const { id, name, email: userEmail, user_avatar } = user;
    res.json({ id, name, email: userEmail, user_avatar });
};

const saveUserData = () => {
    fs.writeFile(userDataPath, JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    });
};

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    // 在 userData 中查找匹配的邮箱
    const user = userData.find((u) => u.email === email);

    if (user) {
        res.status(400).json({ message: "Email already exists" });
        return;
    }

    // 创建新用户并添加到 userData
    const newUser = {
        id: Date.now(),
        name,
        email,
        user_avatar: "/static/images/avatar/Default.jpeg",
        password,
    };
    userData.push(newUser);

    // 保存 userData 到 JSON 文件
    saveUserData();

    // 返回用户信息（不包括密码）
    const { id, name: userName, email: userEmail } = newUser;
    res.json({ id, name: userName, email: userEmail });
};

