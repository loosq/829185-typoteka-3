-- Получить список всех категорий (идентификатор, наименование категории);
SELECT * FROM categories

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT id, name FROM categories JOIN post_categories ON id = category_id GROUP BY id;

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT id, name, count(post_id) FROM categories LEFT JOIN post_categories ON id = category_id GROUP BY id

/*
 Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора,
 контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
*/
SELECT posts.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM posts
  JOIN post_categories ON posts.id = post_categories.post_id
  JOIN categories ON post_categories.category_id = categories.id
  LEFT JOIN comments ON comments.post_id = posts.id
  JOIN users ON users.id = posts.user_id
  GROUP BY posts.id, users.id
  ORDER BY posts.created_at DESC
/*
 Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации,
 дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
*/
SELECT posts.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM posts
  JOIN post_categories ON posts.id = post_categories.post_id
  JOIN categories ON post_categories.category_id = categories.id
  LEFT JOIN comments ON comments.post_id = posts.id
  JOIN users ON users.id = posts.user_id
WHERE posts.id = 1
  GROUP BY posts.id, users.id

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.post_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id,
  comments.post_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.post_id = 1
  ORDER BY comments.created_at DESC

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE posts
SET title = 'Как я встретил Новый год'
WHERE id = 1
