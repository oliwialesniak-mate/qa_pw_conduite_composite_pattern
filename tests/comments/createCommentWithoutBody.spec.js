import { test } from '../_fixtures/fixtures';

test.use({ usersNumber: 1 });

test('Create new comment without body field', async ({
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

  const res = await apiUser.comments.createCommentPayload(slug, { comment: {} }, registeredUser.token);
  await apiUser.comments.assertUnprocessableEntityResponseCode(res);
});
