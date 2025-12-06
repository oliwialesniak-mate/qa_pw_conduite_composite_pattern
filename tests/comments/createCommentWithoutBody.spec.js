import { test } from '../_fixtures/fixtures';
import { ApiComposite } from '../../src/api/ApiComposite';

test.use({ usersNumber: 1 });

test(`Create new comment without body field`, async ({
  registeredUser,
  userRequests,
}) => {
  const api = new ApiComposite(userRequests[0]);

  const aRes = await api.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    registeredUser.token,
  );
  await api.articles.assertSuccessResponseCode(aRes);
  const slug = (await aRes.json()).article.slug;

  const res = await api.comments.createCommentPayload(slug, { comment: {} }, registeredUser.token);
  await api.comments.assertUnprocessableEntityResponseCode(res);
});