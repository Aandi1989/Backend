import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizSecondMigration1714408233435 implements MigrationInterface {
    name = 'QuizSecondMigration1714408233435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "firstUserScore" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "firstUserScore" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "secondUserScore" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "secondUserScore" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "amountOfFinishedGame" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "amountOfFinishedGame" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "amountOfFinishedGame" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "amountOfFinishedGame" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "secondUserScore" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "secondUserScore" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "firstUserScore" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "firstUserScore" DROP NOT NULL`);
    }

}
