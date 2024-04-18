import { MigrationInterface, QueryRunner } from "typeorm";

export class Test21713446185424 implements MigrationInterface {
    name = 'Test21713446185424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "exampleForMigration" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "secondExampleForMigration" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secondExampleForMigration"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "exampleForMigration"`);
    }

}
