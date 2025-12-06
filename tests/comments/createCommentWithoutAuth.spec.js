import { test } from '../_fixtures/fixtures';

test.use({ usersNumber: 1 });

test('Create new comment without auth token', async ({
  api,
  registeredUser,
}) => {
  const apiAuth = api[0];
  const apiAnon = api.anonymous; // assuming your fixture exposes anonymous API

  const createArticleRes = await apiAuth.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    registeredUser.token,
  );
  await apiAuth.articles.assertSuccessResponseCode(createArticleRes);
  const slug = (await createArticleRes.json()).article.slug;

  const res = await apiAnon.comments.createComment(slug, 'should fail', null);
  await apiAnon.comments.assertForbiddenOrUnauthorizedResponseCode(res);
});
