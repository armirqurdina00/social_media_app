const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = require('./models')
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment')
const { Op } = require('sequelize');
require('dotenv').config()

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

const jwtSecret = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ username, email, password: hashedPassword })
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: username } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user }, jwtSecret, { expiresIn: '72h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/posts', verifyToken, async (req, res) => {
    // FIND ALL POSTS
    const posts = await Post.findAll({
        include: [User, { model: Comment, include: [User] }],
        order: [['likes', 'DESC']]
    })
    return res.json(posts)
})

app.get('/user-search', verifyToken, async (req, res) => {
    const user = req.query.user
    const users = await User.findAll({ where: { username: { [Op.startsWith]: `${user}` } } })
    return res.json(users)
})

app.get('/users', verifyToken, async (req, res) => {
    const users = await User.findAll();
    return res.json(users)
})

app.post('/add-comment', verifyToken, async (req, res) => {
    const { post_id, content } = req.body;
    Comment.create({ post_id: post_id, user_id: req.user.user.id, content: content })
    res.status(201).send('Comment added');
});

app.get('/profile', verifyToken, async (req, res) => {
    return res.json(req.user)
});

app.get('/posts/:id/comments', async (req, res) => {
    const post_id = req.params.id;
    const comments = await Comment.findAll( { where: { post_id: post_id }, include: [User] })
    return res.json(comments)
})

app.put('/profile/update', verifyToken, async (req, res) => {
    const { username, email, password } = req.body;
    if (password === '') {
        await User.update({ username: username, email: email }, { where: { username: req.user.user.username } })
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update({ username: username, email: email, password: hashedPassword }, { where: { username: req.user.user.username } })
    }
    res.status(200).send('User updated')
});

app.delete('/profile/delete', verifyToken, async (req, res) => {
    await User.destroy({ where: { username: req.user.user.username } })
    res.status(200).send('User deleted')
});


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})