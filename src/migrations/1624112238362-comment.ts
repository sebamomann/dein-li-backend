import {MigrationInterface, QueryRunner} from "typeorm";

export class comment1624112238362 implements MigrationInterface {
    name = 'comment1624112238362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `link_permission` ADD `comment` varchar(255) NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `link_permission` ADD `expiration` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `report` DROP FOREIGN KEY `FK_6f87884a57b3d8d504e8b6ccb80`");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `call` DROP FOREIGN KEY `FK_7ffd6be398e74e168de1ad7eace`");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `link_permission` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `session` CHANGE `userId` `userId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `report` ADD CONSTRAINT `FK_6f87884a57b3d8d504e8b6ccb80` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `call` ADD CONSTRAINT `FK_7ffd6be398e74e168de1ad7eace` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `link_permission` ADD CONSTRAINT `FK_071cf3f9f84f11a9b1cb4e24ed9` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_3d2f174ef04fb312fdebd0ddc53`");
        await queryRunner.query("ALTER TABLE `link_permission` DROP FOREIGN KEY `FK_071cf3f9f84f11a9b1cb4e24ed9`");
        await queryRunner.query("ALTER TABLE `call` DROP FOREIGN KEY `FK_7ffd6be398e74e168de1ad7eace`");
        await queryRunner.query("ALTER TABLE `report` DROP FOREIGN KEY `FK_6f87884a57b3d8d504e8b6ccb80`");
        await queryRunner.query("ALTER TABLE `session` CHANGE `userId` `userId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `link_permission` CHANGE `linkId` `linkId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(255) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `call` ADD CONSTRAINT `FK_7ffd6be398e74e168de1ad7eace` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(255) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `report` ADD CONSTRAINT `FK_6f87884a57b3d8d504e8b6ccb80` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `link_permission` DROP COLUMN `expiration`");
        await queryRunner.query("ALTER TABLE `link_permission` DROP COLUMN `comment`");
    }

}
