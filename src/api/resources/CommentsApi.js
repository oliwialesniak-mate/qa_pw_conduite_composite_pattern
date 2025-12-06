import { ROUTES } from '../../constants/apiRoutes';

export class CommentsApi {
  constructor(client) {
    this.client = client;
  }

  _headers(token) {
    const base = { 'content-type': 'application/json' };
    return token ? { ...base, Authorization: `Token ${token}` } : base;
  }

  async getComments(slug, token = null) {
    return await this.client.get(ROUTES.articles(slug).comments, {
      headers: this._headers(token),
    });
  }

  async createComment(slug, body, token = null) {
    return await this.client.post(ROUTES.articles(slug).comments, {
      headers: this._headers(token),
      data: { comment: { body } },
    });
  }

  async createCommentPayload(slug, data, token = null) {
    return await this.client.post(ROUTES.articles(slug).comments, {
      headers: this._headers(token),
      data,
    });
  }

  async deleteComment(slug, commentId, token = null) {
    return await this.client.delete(ROUTES.articles(slug).comment(commentId), {
      headers: this._headers(token),
    });
  }

  async assertSuccessResponseCode(response) {
    const ok = response.ok?.() ?? (response.status() >= 200 && response.status() < 300);
    if (!ok) throw new Error(`Expected 2xx, got ${response.status()} — ${await response.text().catch(() => '')}`);
  }

  async assertUnauthorizedResponseCode(response) {
    const s = response.status();
    if (s !== 401) throw new Error(`Expected 401, got ${s} — ${await response.text().catch(() => '')}`);
  }

  async assertForbiddenOrUnauthorizedResponseCode(response) {
    const s = response.status();
    if (s !== 401 && s !== 403) throw new Error(`Expected 401/403, got ${s} — ${await response.text().catch(() => '')}`);
  }

  async assertUnprocessableEntityResponseCode(response) {
    const s = response.status();
    if (s !== 422 && s !== 400) throw new Error(`Expected 422/400, got ${s} — ${await response.text().catch(() => '')}`);
  }

  async assertCommentBodyEquals(response, expectedBody) {
    const json = await response.json();
    const actual = json?.comment?.body;
    if (actual !== expectedBody) throw new Error(`Expected comment.body="${expectedBody}", got "${actual}"`);
  }

  async assertCommentsListContainsId(listResponse, expectedId) {
    const list = (await listResponse.json())?.comments ?? [];
    if (!list.some(c => c.id === expectedId)) throw new Error(`Expected comments to contain id=${expectedId}`);
  }

  async assertCommentsListNotContainsId(listResponse, id) {
    const list = (await listResponse.json())?.comments ?? [];
    if (list.some(c => c.id === id)) throw new Error(`Expected comments to NOT contain id=${id}`);
  }
}