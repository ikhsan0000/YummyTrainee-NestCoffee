module.exports =
{
    type: 'mysql',
    host: 'localhost',
    port: 2021,
    username: 'root',
    password: '',
    database: 'nest_coffee',
    entities: ['dist/**/*.entity.js'],
    migration: ['dist/migration/*.js'],
    cli:
    {
        migrationsDir: 'src/migrations'
    },
}