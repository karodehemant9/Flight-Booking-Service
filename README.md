This is a base node js project template, which anyone can use as it has been prepared, by keeping some of the most important code principles and project management recommendations. Feel free to change anything. 


`src` -> Inside the src folder all the actual source code regarding the project will reside, this will not include any kind of tests. (You might want to make separate tests folder)

Lets take a look inside the `src` folder

 - `config` -> In this folder anything and everything regarding any configurations or setup of a library or module will be done. For example: setting up `dotenv` so that we can use the environment variables anywhere in a cleaner fashion, this is done in the `server-config.js`. One more example can be to setup you logging library that can help you to prepare meaningful logs, so configuration for this library should also be done here. 

 - `routes` -> In the routes folder, we register a route and the corresponding middleware and controllers to it. 

 - `middlewares` -> they are just going to intercept the incoming requests where we can write our validators, authenticators etc. 

 - `controllers` -> they are kind of the last middlewares as post them you call you business layer to execute the budiness logic. In controllers we just receive the incoming requests and data and then pass it to the business layer, and once business layer returns an output, we structure the API response in controllers and send the output. 

 - `repositories` -> this folder contains all the logic using which we interact the DB by writing queries, all the raw queries or ORM queries will go here.

 - `services` -> contains the buiness logic and interacts with repositories for data from the database

 - `utils` -> contains helper methods, error classes etc.

 - `migrations` -> The migrations folder holds database migration scripts — versioned, repeatable changes to your database schema (create/alter/drop tables, add indexes, etc.). Migrations let teams evolve schema safely, apply or rollback changes, and keep schema in sync across environments. They work together with models, seeders, and your repository layer.

Key points
- Each migration is typically a timestamped file with up (apply) and down (rollback) functions.
- Managed by tools like Sequelize (sequelize-cli/umzug), Knex, TypeORM, etc.
- You run them with CLI commands (e.g., npx sequelize-cli db:migrate or npx knex migrate:latest).
- Keep migrations in source control; never edit already-applied migrations — create a new one to change the schema.

- `Seeders` -> Seeders (seed files) populate the database with initial or sample data (fixtures) — e.g., admin accounts, lookup tables, demo data for development/tests.

Key points
- Purpose: insert baseline or test data after schema exists (after migrations).
- Typical contents: idempotent insert/update logic for tables (users, roles, settings).
- Run via CLI of your migration tool (Sequelize, Knex, TypeORM, etc.).
- Keep seeders in source control; avoid secrets in seed data.
- Prefer creating new seeders to modify data instead of editing applied ones.

### Setup the project

 - Download this template from github and open it in your favourite text editor. 
 - Go inside the folder path and execute the following command:
  ```
  npm install
  ```
 - In the root directory create a `.env` file and add the following env variables
    ```
        PORT=<port number of your choice>
    ```
    ex: 
    ```
        PORT=3000
    ```
 - go inside the `src` folder and execute the following command:
    ```
      npx sequelize init
    ```
 - By executing the above command you will get migrations and seeders folder along with a config.json inside the config folder. 
 - If you're setting up your development environment, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, mariadb etc
 - If you're setting up test or prod environment, make sure you also replace the host with the hosted db url.

 - To run the server execute
 ```
 npm run dev
 ```