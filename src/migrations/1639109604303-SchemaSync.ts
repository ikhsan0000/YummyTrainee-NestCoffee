import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1639109604303 implements MigrationInterface {
    name = 'SchemaSync1639109604303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`payload\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`coffee\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`coffee\` ADD \`recommendations\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`coffee\` DROP COLUMN \`recommendations\``);
        await queryRunner.query(`ALTER TABLE \`coffee\` DROP COLUMN \`description\``);
        await queryRunner.query(`DROP TABLE \`event\``);
    }

}
