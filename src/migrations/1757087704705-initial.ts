import { MigrationInterface, QueryRunner } from "typeorm";
//    npm run migration:create src/migrations/prueba (manuales)
//    npm run build
//    npm run migration:run

// p/sincronizar la base de datos a nuestras entidades:
// npm run migration:generate src/migrations/initial
// npm run build
// npm run migration:run

export class Initial1757087704705 implements MigrationInterface {
    name = 'Initial1757087704705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "name" character varying NOT NULL, 
            "email" character varying NOT NULL, 
            "createdAt" character varying NOT NULL, 
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);

        await queryRunner.query(
            `CREATE TABLE "todos" (
            "id" SERIAL NOT NULL, 
            "title" character varying NOT NULL, 
            "description" character varying NOT NULL, 
            "completed" boolean NOT NULL DEFAULT false, 
            CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "todos"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
