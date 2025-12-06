import { test } from '../_fixtures/fixtures';
import { ApiComposite } from '../../src/api/ApiComposite';

test.use({ usersNumber: 2 });

test(`Create new comment to the article created by another user`, async ({
  registeredUsers,
  userRequests,
}) => {
  const userA = registeredUsers[0];
  const userB = registeredUsers[1];

  const apiA = new ApiComposite(userRequests[0]);
  const apiB = new ApiComposite(userRequests[1]);

  const article = {
    title: `t-${Date.now()}`,
    description: 'desc',
    body: 'body',
    tagList: [],
  };

  const createArticleRes = await apiA.articles.createArticle(article, userA.token);
  await apiA.articles.assertSuccessResponseCode(createArticleRes);
  const slug = (await createArticleRes.json()).article.slug;

  const body = `Nice post ${Math.random().toString(36).slice(2, 8)}`;
  const createCommentRes = await apiB.comments.createComment(slug, body, userB.token);
  await apiB.comments.assertSuccessResponseCode(createCommentRes);
  await apiB.comments.assertCommentBodyEquals(createCommentRes, body);

  const commentId = (await createCommentRes.json())?.comment?.id;
  const listRes = await apiB.comments.getComments(slug, userB.token);
  await apiB.comments.assertSuccessResponseCode(listRes);
  await apiB.comments.assertCommentsListContainsId(listRes, commentId);
});