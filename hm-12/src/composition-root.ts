import { JwtService } from "./application/jwt-service";
import { AuthController } from "./controllers/authController";
import { BlogsController } from "./controllers/blogsController";
import { CommentsController } from "./controllers/commentsController";
import { PostsController } from "./controllers/postsController";
import { SecurityController } from "./controllers/securityController";
import { UsersController } from "./controllers/usersController";
import { AuthService } from "./domain/auth-service";
import { BlogsService } from "./domain/blogs-service";
import { CommentsService } from "./domain/comments-service";
import { PostsService } from "./domain/posts-service";
import { SecurityService } from "./domain/security-service";
import { UsersService } from "./domain/users-service";
import { AuthRepository } from "./repositories/auth-db-repository";
import { AuthQueryRepo } from "./repositories/authQueryRepository";
import { BlogsRepository } from "./repositories/blogs-db-repository";
import { BlogsQueryRepo } from "./repositories/blogsQueryRepository";
import { CommentsRepository } from "./repositories/comments-db-repository";
import { CommentsQueryRepo } from "./repositories/commentsQueryRepository";
import { LikesRepository } from "./repositories/likes-db-repository";
import { LikesQueryRepo } from "./repositories/likesQueryRepository";
import { PostsRepository } from "./repositories/posts-db-repository";
import { PostsQueryRepo } from "./repositories/postsQueryRepository";
import { SecurityRepository } from "./repositories/security-db-repository";
import { SecurityQueryRepo } from "./repositories/securityQueryRepository";
import { UsersRepository } from "./repositories/users-db-repository";
import { UsersQueryRepo } from "./repositories/usersQueryRepository";

export const jwtService = new JwtService();

const authRepository = new AuthRepository();
export const authQueryRepo = new AuthQueryRepo();
const blogsRepository = new BlogsRepository();
const blogsQueryRepo = new BlogsQueryRepo();
const commentsRepository = new CommentsRepository();
const commentsQueryRepo = new CommentsQueryRepo();
const postsRepository = new PostsRepository();
const postsQueryRepo = new PostsQueryRepo();
const securityRepository = new SecurityRepository();
const securityQueryRepo = new SecurityQueryRepo(jwtService);
const usersRepository = new UsersRepository();
export const usersQueryRepo = new UsersQueryRepo();
const likesRepository = new LikesRepository();
const likesQueryRepo = new LikesQueryRepo();


export const authService = new AuthService(usersRepository, authRepository, authQueryRepo, jwtService);
const blogsService = new BlogsService(blogsRepository);
const commentsService = new CommentsService(commentsRepository, commentsQueryRepo);
const postsService = new PostsService(commentsRepository, postsRepository, postsQueryRepo, likesRepository, likesQueryRepo);
const securityService = new SecurityService(jwtService, securityRepository, securityQueryRepo);
const usersService = new UsersService(usersRepository, usersQueryRepo);


export const authController = new AuthController(usersQueryRepo, jwtService, authService, usersService);
export const blogsController = new BlogsController(blogsService, postsService, blogsQueryRepo, postsQueryRepo);
export const commentsController = new CommentsController(commentsService, commentsQueryRepo, jwtService);
export const postsController = new PostsController(commentsService, postsService, commentsQueryRepo, postsQueryRepo, jwtService);
export const securityController = new SecurityController(securityService, securityQueryRepo);
export const usersController = new UsersController(usersService, usersQueryRepo);
