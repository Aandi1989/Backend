import { MigrationInterface, QueryRunner } from "typeorm";

export class NewBDforTesting1713800231854 implements MigrationInterface {
    name = 'NewBDforTesting1713800231854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "createdAt" character varying NOT NULL, "isMembership" boolean NOT NULL, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogId" uuid NOT NULL, "blogName" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "postId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_700a22aa0bad878ccc8ebb8ba81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "commentId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_1f998c484b8e003a951dc0bcfc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "postId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordSalt" character varying NOT NULL, "createdAt" character varying NOT NULL, "confirmationCode" character varying NOT NULL, "confCodeExpDate" character varying NOT NULL, "confCodeConfirmed" boolean NOT NULL, "recoveryCode" character varying NOT NULL, "recCodeExpDate" character varying NOT NULL, "recCodeConfirmed" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "iat" character varying NOT NULL, "deviceId" uuid NOT NULL, "deviceName" character varying NOT NULL, "ip" character varying NOT NULL, "exp" character varying NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ADD CONSTRAINT "FK_aa28259ec0da53a0fbfb7001740" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ADD CONSTRAINT "FK_fb8e98e66ffa9830b0548711d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ADD CONSTRAINT "FK_4a899a90dc6049046c4ec8d22b8" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ADD CONSTRAINT "FK_2968feb7b1f85accbe87f415189" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "likes_comments" DROP CONSTRAINT "FK_2968feb7b1f85accbe87f415189"`);
        await queryRunner.query(`ALTER TABLE "likes_comments" DROP CONSTRAINT "FK_4a899a90dc6049046c4ec8d22b8"`);
        await queryRunner.query(`ALTER TABLE "likes_posts" DROP CONSTRAINT "FK_fb8e98e66ffa9830b0548711d39"`);
        await queryRunner.query(`ALTER TABLE "likes_posts" DROP CONSTRAINT "FK_aa28259ec0da53a0fbfb7001740"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "likes_comments"`);
        await queryRunner.query(`DROP TABLE "likes_posts"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
