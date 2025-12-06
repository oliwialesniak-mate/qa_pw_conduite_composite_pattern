import { test } from '../_fixtures/fixtures';
import { ApiComposite } from '../../src/api/ApiComposite';

test.use({ usersNumber: 1 });

test(`Delete comment added by the same user`, async ({
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

  const cRes = await api.comments.createComment(
    slug,
    `mine-${Math.random().toString(36).slice(2, 6)}`,
    registeredUser.token,
  );
  await api.comments.assertSuccessResponseCode(cRes);
  const commentId = (await cRes.json())?.comment?.id;

  const delRes = await api.comments.deleteComment(slug, commentId, registeredUser.token);
  await api.comments.assertSuccessResponseCode(delRes);

  const listRes = await api.comments.getComments(slug, registeredUser.token);
  await api.comments.assertSuccessResponseCode(listRes);
  await api.comments.assertCommentsListNotContainsId(listRes, commentId);
});