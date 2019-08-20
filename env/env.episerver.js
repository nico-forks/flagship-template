const common = require('./common');

module.exports = {
  ...common,
  dataSource: {
    type: 'episerver',
    categoryFormat: 'list',
    catalogName: 'Fashion',
    apiConfig: {
      apiHost: 'https://episerver.uat.bbhosted.com',
    },
    promoProducts: {
      categoryId: 'shirts',
      title: 'Recommended for You'
    }
  },
};
