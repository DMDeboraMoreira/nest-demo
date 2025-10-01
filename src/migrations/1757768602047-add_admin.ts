import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1757768602047 implements MigrationInterface {
    name = 'AddAdmin1757768602047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }

}
