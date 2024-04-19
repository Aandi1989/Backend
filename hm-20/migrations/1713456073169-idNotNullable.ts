import { MigrationInterface, QueryRunner } from "typeorm";

export class IdNotNullable1713456073169 implements MigrationInterface {
    name = 'IdNotNullable1713456073169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes_posts" DROP CONSTRAINT "FK_aa28259ec0da53a0fbfb7001740"`);
        await queryRunner.query(`ALTER TABLE "likes_posts" DROP CONSTRAINT "FK_fb8e98e66ffa9830b0548711d39"`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ALTER COLUMN "postId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_comments" DROP CONSTRAINT "FK_4a899a90dc6049046c4ec8d22b8"`);
        await queryRunner.query(`ALTER TABLE "likes_comments" DROP CONSTRAINT "FK_2968feb7b1f85accbe87f415189"`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ALTER COLUMN "commentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "postId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "userId" SET NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "postId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ALTER COLUMN "commentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ADD CONSTRAINT "FK_2968feb7b1f85accbe87f415189" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_comments" ADD CONSTRAINT "FK_4a899a90dc6049046c4ec8d22b8" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ALTER COLUMN "postId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ADD CONSTRAINT "FK_fb8e98e66ffa9830b0548711d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes_posts" ADD CONSTRAINT "FK_aa28259ec0da53a0fbfb7001740" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
