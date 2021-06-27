'use strict';

const express = require(`express`);
const app = express();
const path = require(`path`);
const port = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const {
  myRoutes,
  mainRoutes,
  articlesRoutes
} = require(`./routes`);

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use((err, req, res, next) => {
  console.log(`Something went wrong`, err);
  next(err);
});

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((req, res) => res.status(500).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(port);