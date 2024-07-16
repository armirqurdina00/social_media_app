const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Like = require('./Like');

// Define associations
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });
User.hasMany(Like, { foreignKey: 'user_id' });
Post.hasMany(Like, { foreignKey: 'post_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });

const db = {
  sequelize,
  User,
  Post,
  Comment
};

// Export the database object containing the models and sequelize instance
module.exports = db;