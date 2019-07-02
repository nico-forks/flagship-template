const common = require('./common');

module.exports = {
  ...common,
  dataSource: {
    type: 'episerver',
    categoryFormat: 'list',
    catalogName: 'Fashion',
    apiConfig: {
      apiHost: 'http://localhost:3000',
    }
  }
};
