import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizFifthMigration1714557573914 implements MigrationInterface {
    name = 'QuizFifthMigration1714557573914'

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
