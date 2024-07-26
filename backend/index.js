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
const Like = require('./models/Like')
const { Op } = require('sequelize');
require('dotenv').config()

const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

// const corsOptions = {
//     origin: 'http://localhost:3000', // Replace with your frontend domain
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//     credentials: true // Enable if you need to send cookies
//   };


const jwtSecret = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    // console.log(token)
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

// Create a storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'frontend', 'public');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Expect the field name 'images' in the form data

// API ROUTES //

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

app.get('/posts', async (req, res) => {
    const posts = await Post.findAll({
        include: [User, { model: Comment, include: [User] }, { model: Like, include: [User] }],
        // order: [[Like, 'count', 'DESC']]
    })
    return res.json(posts)
})

// app.options('/post/add', function (req, res) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     res.end();
//   });

app.post('/post/add', verifyToken, upload.array('images'), async (req, res) => {
    let picName = ''
    if (req.files.length) {
        picName = req.files[0].filename
    }
    const content = req.body.content
    if (picName) {
        Post.create({ content: content, image: picName, user_id: req.user.user.id })
    }
    else {
        Post.create({ content: content, user_id: req.user.user.id })
    }
    res.status(201).send('Post added');
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
    const comments = await Comment.findAll({ where: { post_id: post_id }, include: [User] })
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

app.post('/like/add', verifyToken, async (req, res) => {
    const { post_id } = req.body;
    const like = await Like.create({ post_id: post_id, user_id: req.user.user.id });
    res.status(200).send('Like created');
});

app.delete('/like/delete', verifyToken, async (req, res) => {
    const { post_id } = req.body;
    await Like.destroy({ where: { post_id: post_id, user_id: req.user.user.id } })
    res.status(200).send('Like deleted');
});

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})