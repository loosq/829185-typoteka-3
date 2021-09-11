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

articlesRouter.get(`/categories/:id`, (req, res) => res.send(`/category/:id ${req.params.id}`));
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  const user = req.session;

  res.render(`admin-add-new-post-empty`, {categories, error, user, csrfToken: req.csrfToken()});
});
articlesRouter.post(`/add`,
    auth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {title, announcement, categories, fullText} = body;

      const article = {
        title,
        picture: file && file.filename,
        announce: announcement,
        fullText,
        categories
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
  const user = req.session;

  res.render(`admin-add-new-post`, {article, user, csrfToken: req.csrfToken()});
});
articlesRouter.get(`/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id, true);
  const {error} = req.query;
  const {user} = req.session;
  res.render(`post-user`, {article, error, user});
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
