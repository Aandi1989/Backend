export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  UNAUTHORIZED_401 = 401,
  ACCESS_FORBIDDEN_403 = 403,
  NOT_FOUND_404 = 404,
  TO_MANY_REQUESTS_429 = 429,
}

export const RouterPaths = {
  blogsSA:'sa/blogs',
  blogger:'blogger',
  posts: 'posts',
  blogs: 'blogs',
  usersSA: 'sa/users',
  comments: 'comments',
  auth: 'auth',
  security: 'security',
  telegram: 'integrations/telegram',
  testingAllData: 'testing/all-data',

  quizQuestion: 'sa/quiz/questions',
  pairGame: 'pair-game-quiz',

  __test__: 'testing',
};

export type DBType = "postgres" | "mysql" | "mariadb" | "cockroachdb" | "aurora-mysql"

// ngrok http http://localhost:8080

