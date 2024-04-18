import { MigrationInterface, QueryRunner } from "typeorm";

export class Test31713447741997 implements MigrationInterface {
    name = 'Test31713447741997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "exampleForMigration" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "secondExampleForMigration" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "thirdExampleForMigration" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "thirdExampleForMigration"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secondExampleForMigration"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "exampleForMigration"`);
    }

}
