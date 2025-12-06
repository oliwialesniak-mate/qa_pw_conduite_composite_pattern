export const ROOT = 'api';

export const ROUTES = {
  user: `${ROOT}/user`,
  users: {
    index: `${ROOT}/users`,
    login: `${ROOT}/users/login`,
  },
  profiles: username => ({
    index: `${ROOT}/profiles/${username}`,
    follow: `${ROOT}/profiles/${username}/follow`,
  }),
  articles: slug => ({
    index: `${ROOT}/articles`,
    single: `${ROOT}/articles/${slug}`,
    favorite: `${ROOT}/articles/${slug}/favorite`,
    comments: `${ROOT}/articles/${slug}/comments`,
    comment: id => `${ROOT}/articles/${slug}/comments/${id}`,
  }),
};