'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const multer = require(`multer`);
const auth = require(`../middlewares/auth`);
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});
const csrf = require(`csurf`);
const csrfProtection = csrf();
const moment = require(`moment`);

articlesRouter.get(`/categories/:id`, (req, res) => res.send(`/category/:id ${req.params.id}`));
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  const {user} = req.session;

  res.render(`articles/article-add-empty`, {categories, error, user, csrfToken: req.csrfToken()});
});
articlesRouter.post(`/add`,
    auth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {title, announcement, categories, fullText} = body;
      const {user} = req.session;

      const article = {
        user,
        title,
        picture: file && file.filename,
        announce: announcement,
        fullText,
        categories: Array.isArray(categories) ? categories : [categories]
      };

      try {
        await api.createArticle(article);
        res.redirect(`/my`);
      } catch (error) {
        res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data)}`);
      }
    });
articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const article = await api.getArticle(req.params.id);
  const {user} = req.session;

  res.render(`articles/article-add`, {article, user, csrfToken: req.csrfToken()});
});
articlesRouter.get(`/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id, true);
  const {error} = req.query;
  const {user} = req.session;
  res.render(`articles/article`, {article, error, user, moment});
});

articlesRouter.post(`/:id/comments`, auth, async (req, res) => {
  const {id} = req.params;
  const {text} = req.body;
  const {user} = req.session;

  try {
    await api.createComment(id, {name: text.trim(), userId: user.id});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
