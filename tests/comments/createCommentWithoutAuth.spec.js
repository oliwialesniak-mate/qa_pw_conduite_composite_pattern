import { test } from '../_fixtures/fixtures';
import { ApiComposite } from '../../src/api/ApiComposite';

test.use({ usersNumber: 1 });

test(`Create new comment without auth token`, async ({
  registeredUser,
  userRequests,
  request,
}) => {
  const apiAuth = new ApiComposite(userRequests[0]);
  const apiAnon = new ApiComposite(request);

  const createArticleRes = await apiAuth.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    registeredUser.token,
  );
  await apiAuth.articles.assertSuccessResponseCode(createArticleRes);
  const slug = (await createArticleRes.json()).article.slug;

  const res = await apiAnon.comments.createComment(slug, 'should fail', null);
  await apiAnon.comments.assertForbiddenOrUnauthorizedResponseCode(res);
});