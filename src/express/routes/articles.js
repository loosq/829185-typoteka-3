'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {mostPopularArticles, getCurrentDate} = require(`../../service/utils`);
const api = require(`../api`).getAPI();
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const multer = require(`multer`);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});

const ARTICLES_PER_PAGE = 4;

articlesRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = ARTICLES_PER_PAGE;

  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categoriesToArticles
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const sortedArticles = mostPopularArticles(articles);
  // TODO добавить в коммент дату и сортировать по ней
  const lastCommentedArticles = sortedArticles.slice(0, 3);
  // количество страниц — это общее количество объявлений, поделённое на количество объявлений на странице (с округлением вверх)
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  // передадим все эти данные в шаблон
  res.render(`main`, {articles, categoriesToArticles, lastCommentedArticles, sortedArticles, page, totalPages});
});
articlesRouter.get(`/categories/:id`, (req, res) => res.send(`/category/:id ${req.params.id}`));
let categories;
articlesRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();

  res.render(`admin-add-new-post-empty`, {categories, error});
});

articlesRouter.post(`/add`,
    upload.single(`upload`),
    async (req, res) => {
      const {body, file} = req;
      const {title,announcement, categories, fullText} = body;

      const article = {
        title: title,
        picture: file && file.filename,
        announce: announcement,
        fullText: fullText,
        categories: categories
      };

      try {
        await api.createArticle(article);
        res.redirect(`/my`);
      } catch (error) {
        res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data)}`);
      }
    });
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id);

  res.render(`admin-add-new-post`, {article});
});
articlesRouter.get(`/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id, true);

  res.render(`post-user`, {article});
});

module.exports = articlesRouter;
