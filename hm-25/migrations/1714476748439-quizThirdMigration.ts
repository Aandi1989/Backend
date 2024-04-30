import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizThirdMigration1714476748439 implements MigrationInterface {
    name = 'QuizThirdMigration1714476748439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_waiting_for_game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, CONSTRAINT "PK_2a20e50cf0e885e356abddd7b10" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_waiting_for_game"`);
    }

}
