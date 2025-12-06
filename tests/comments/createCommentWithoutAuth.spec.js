import { test } from '../_fixtures/fixtures';

test.use({ usersNumber: 1 });

test('Create new comment without auth token', async ({
  api,
  registeredUser,
}) => {
  const apiUser = api[0];

  const createArticleRes = await apiUser.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    registeredUser.token,
  );
  await apiUser.articles.assertSuccessResponseCode(createArticleRes);

  const slug = (await createArticleRes.json()).article.slug;

  // Anonymous request: pass null token
  const res = await apiUser.comments.createComment(slug, 'should fail', null);

  await apiUser.comments.assertForbiddenOrUnauthorizedResponseCode(res);
});
