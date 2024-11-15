const User = require('./user');
const ApiKey = require('./apiKey');
const Lead = require('./lead');

// User - ApiKey associations
User.hasMany(ApiKey, {
  foreignKey: 'userId',
  as: 'apiKeys',
  onDelete: 'CASCADE'
});
ApiKey.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User - Lead associations
User.hasMany(Lead, {
  foreignKey: 'userId',
  as: 'leads',
  onDelete: 'CASCADE'
});
Lead.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  ApiKey,
  Lead
};