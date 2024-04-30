import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizFourthMigration1714478720687 implements MigrationInterface {
    name = 'QuizFourthMigration1714478720687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "correctAnswer" TO "correctAnswers"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "correctAnswers"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "correctAnswers" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "correctAnswers"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "correctAnswers" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "correctAnswers" TO "correctAnswer"`);
    }

}
