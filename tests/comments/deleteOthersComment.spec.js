import { test } from '../_fixtures/fixtures';
import { ApiComposite } from '../../src/api/ApiComposite';

test.use({ usersNumber: 2 });

test(`Delete comment added by the another user`, async ({
  registeredUsers,
  userRequests,
}) => {
  const userA = registeredUsers[0];
  const userB = registeredUsers[1];

  const apiA = new ApiComposite(userRequests[0]);
  const apiB = new ApiComposite(userRequests[1]);

  const aRes = await apiA.articles.createArticle(
    { title: `t-${Date.now()}`, description: 'd', body: 'b', tagList: [] },
    userA.token,
  );
  await apiA.articles.assertSuccessResponseCode(aRes);
  const slug = (await aRes.json()).article.slug;

  const cRes = await apiB.comments.createComment(
    slug,
    `byB-${Math.random().toString(36).slice(2, 6)}`,
    userB.token,
  );
  await apiB.comments.assertSuccessResponseCode(cRes);
  const commentId = (await cRes.json())?.comment?.id;

  const delRes = await apiA.comments.deleteComment(slug, commentId, userA.token);
  await apiA.comments.assertForbiddenOrUnauthorizedResponseCode(delRes);
});