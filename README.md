# Northcoders News

### Background

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

6. At this point, to test our server is working, install nodemon and run it in bash:

```bash
npm i nodemon
npm run dev
```

7. If it's working you should recieve something like this:

```bash
listening on port 9090...
Connected to mongodb://localhost:27017/nc-news-dev
```

### Step 3 - Seeding the database

1. Seed your database!

```bash
node ./seed/seed.dev.js
```
