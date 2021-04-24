'use strict';

const express = require(`express`);
const path = require(`path`);
const port = 8080;
const PUBLIC_DIR = `public`;
const app = express();
const myRoutes = require(`../routes/my`);
const articlesRoutes = require(`../routes/articles`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.get(`/`, (req, res) => res.render(`main.pug`));
app.get(`/login`, (req, res) => res.render(`sign-in.pug`));
app.get(`/sing-up`, (req, res) => res.render(`registration.pug`));
app.get(`/search-1`, (req, res) => res.render(`search-1.pug`));
app.get(`/post`, (req, res) => res.render(`post-user.pug`));
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res, next) => {
  res.status(500).render(`errors/500`);
  next();
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(port);
