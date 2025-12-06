import { UsersApi } from './resources/UsersApi';
import { ProfilesApi } from './resources/ProfilesApi';
import { ArticlesApi } from './resources/ArticlesApi';
import { CommentsApi } from './resources/CommentsApi';

export class ApiComposite {
  constructor(client) {
    this.client = client;
    this.users = new UsersApi(client);
    this.profiles = new ProfilesApi(client);
    this.articles = new ArticlesApi(client);
    this.comments = new CommentsApi(client); // ← added
  }

  // --- Users
  async registerNewUser(userData, token = null) {
    return await this.users.registerNewUser(userData, token);
  }
  async updateUser(userData) {
    return await this.users.updateUser(userData);
  }
  async loginUser(userData) {
    return await this.users.loginUser(userData);
  }

  // --- Profiles
  async getProfile(username, token = null) {
    return await this.profiles.getProfile(username, token);
  }
  async followProfile(username) {
    return await this.profiles.followProfile(username);
  }
  async unfollowProfile(username) {
    return await this.profiles.unfollowProfile(username);
  }

  // --- Articles
  async createArticle(article, token = null) {
    return await this.articles.createArticle(article, token);
  }
  async getArticleBySlug(slug, token = null) {
    return await this.articles.getArticleBySlug(slug, token);
  }

  // --- Comments
  async getComments(slug, token = null) {
    return await this.comments.getComments(slug, token);
  }
  async createComment(slug, body, token = null) {
    return await this.comments.createComment(slug, body, token);
  }
  async deleteComment(slug, commentId, token = null) {
    return await this.comments.deleteComment(slug, commentId, token);
  }

  // --- Common asserts passthrough
  async assertSuccessResponseCode(response) {
    await this.users.assertSuccessResponseCode(response);
  }
}