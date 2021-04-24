'use strict';

const express = require(`express`);
const app = express();
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const port = 8080;

app.get(`/`, (req, res) => res.send(`/`));
app.get(`/register`, (req, res) => res.send(`/register`));
app.get(`/login`, (req, res) => res.send(`/login`));
app.get(`/search`, (req, res) => res.send(`/search`));
app.get(`/categories `, (req, res) => res.send(`/categories `));
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(port);
