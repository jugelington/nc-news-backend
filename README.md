# Northcoders News

### Background

This repo allows you to create an NC News server in express using mongoose, and database in Mongo; a working version of it is hosted at:

https://sheltered-sands-58798.herokuapp.com/

### Step 1 - Cloning the repository

1. Git clone this repository - If you're on github, click on the "Clone or download" button, and copy the URL that appears.
2. Open your terminal, and navigate to the directory that you want to save this repository to:

```bash
cd /example/directory/path
```

3. Clone the repository:

```bash
git clone https://github.com/jugelington/BE2-northcoders-news.git
```

### Step 2 - Configuring your enviroment

1.  Next, cd into the directory you just created with git clone"

```bash
cd BE2-northcoders-news
```

2. Open up the folder in visual studio:

```bash
code .
```

3. Open the terminal in visual studio
4. Install express and mongoose so our server can interact with the database

```bash
npm i express
npm i mongoose
```

5. Create config folder, and inside it, create a file called index.js which should look like:

```js
const ENV = process.env.NODE_ENV || 'development';

const config = {
  development: { DB_URL: 'mongodb://localhost:27017/nc-news-dev' },
  test: { DB_URL: 'mongodb://localhost:27017/nc-news-test' }
};

module.exports = config[ENV].DB_URL;
```

### Step 3 - MLab

1. If you haven't already, sign up for MLabs!
2. Create a new database
3. Create a new user for that database; you'll need this information in the next step

### Step 4 - Heroku

1. If you haven't already, sign up for Heroku!
2. Install the heroku CLI

```bash
npm install -g heroku
```

3. Log into the heroku CLI

```bash
heroku login
```

4. Create your heroku project

```bash
heroku create <your project name>
```

5. Push your repo to heroku

```bash
git push heroku master
```

6. Setup some variables heroku will need:

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb://<username>:<password>@ds141783.mlab.com:41783/<database>
```

### Step 5 - Seed

1. Now you should just need to seed your database!

```bash
NODE_ENV=production node <path-to-file-that-runs-your-seed>
```

### Step 6 - Relax!

Hopefully it's all working now!
