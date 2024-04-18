import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1713446101847 implements MigrationInterface {
    name = 'Test1713446101847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "exampleForMigration" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "exampleForMigration"`);
    }

}
