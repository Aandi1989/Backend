import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizFirstMigration1714407551987 implements MigrationInterface {
    name = 'QuizFirstMigration1714407551987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstUserId" uuid, "secondUserId" uuid, "status" character varying NOT NULL, "pairCreatedDate" character varying NOT NULL, "startGameDate" character varying, "finishGameDate" character varying, "winnerId" uuid, "loserId" uuid, "firstUserScore" integer, "secondUserScore" integer, "amountOfFinishedGame" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "playerId" character varying NOT NULL, "questionId" character varying NOT NULL, "answerStatus" character varying NOT NULL, "addedAt" character varying NOT NULL, "sequence" integer NOT NULL, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "correctAnswer" character varying NOT NULL, "published" boolean NOT NULL, "createdAt" character varying NOT NULL, "updatedAt" character varying NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "questionId" uuid NOT NULL, "sequence" integer NOT NULL, CONSTRAINT "PK_08867ba249fa9d179d5449d27d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_cdf2cd157111cc483c57a95f3a6" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_question" ADD CONSTRAINT "FK_d35bdfc9ff116d456dcad4a580e" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_question" ADD CONSTRAINT "FK_0040e663701d18ed9d1c49ecf6b" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_question" DROP CONSTRAINT "FK_0040e663701d18ed9d1c49ecf6b"`);
        await queryRunner.query(`ALTER TABLE "game_question" DROP CONSTRAINT "FK_d35bdfc9ff116d456dcad4a580e"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_cdf2cd157111cc483c57a95f3a6"`);
        await queryRunner.query(`DROP TABLE "game_question"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
