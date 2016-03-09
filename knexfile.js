module.exports = {

  development: {
    client: 'pg',
    connection: {
      database : 'dylan_live'
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'dylan_live'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'dylan_live'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
