import { test } from '../_fixtures/fixtures';

test.use({ usersNumber: 1 });

test('Delete comment added by the same user', async ({
  api,
  registeredUser,
}) => {
  const apiUser = api[0];

  const aRes = await apiUser.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    registeredUser.token,
  );
  await apiUser.articles.assertSuccessResponseCode(aRes);

  const slug = (await aRes.json()).article.slug;

  const cRes = await apiUser.comments.createComment(
    slug,
    `mine-${Math.random().toString(36).slice(2, 6)}`,
    registeredUser.token,
  );
  await apiUser.comments.assertSuccessResponseCode(cRes);

  const commentId = (await cRes.json())?.comment?.id;

  const delRes = await apiUser.comments.deleteComment(
    slug,
    commentId,
    registeredUser.token,
  );
  await apiUser.comments.assertSuccessResponseCode(delRes);

  const listRes = await apiUser.comments.getComments(slug, registeredUser.token);
  await apiUser.comments.assertSuccessResponseCode(listRes);
  await apiUser.comments.assertCommentsListNotContainsId(listRes, commentId);
});
