import {MigrationInterface, QueryRunner} from "typeorm";

export class test1613470150849 implements MigrationInterface {
    name = 'test1613470150849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `report` DROP FOREIGN KEY `FK_e347c56b008c2057c9887e230aa`");
        await queryRunner.query("ALTER TABLE `link` DROP FOREIGN KEY `FK_9f7e4faa3c0bb12b46a1a66ddcb`");
        await queryRunner.query("ALTER TABLE `report` DROP FOREIGN KEY `FK_6f87884a57b3d8d504e8b6ccb80`");
        await queryRunner.query("ALTER TABLE `report` CHANGE `userId` `userId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `call` DROP FOREIGN KEY `FK_7ffd6be398e74e168de1ad7eace`");
        await queryRunner.query("ALTER TABLE `call` CHANGE `status` `status` int NOT NULL DEFAULT '1'");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `report` ADD CONSTRAINT `FK_6f87884a57b3d8d504e8b6ccb80` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `call` ADD CONSTRAINT `FK_7ffd6be398e74e168de1ad7eace` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");

        await queryRunner.query("ALTER TABLE `session` RENAME TO `depr_session`");
        await queryRunner.query("ALTER TABLE `user` RENAME TO `depr_user`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `depr_session` RENAME TO `session`");
        await queryRunner.query("ALTER TABLE `depr_user` RENAME TO `user`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_3d2f174ef04fb312fdebd0ddc53`");
        await queryRunner.query("ALTER TABLE `call` DROP FOREIGN KEY `FK_7ffd6be398e74e168de1ad7eace`");
        await queryRunner.query("ALTER TABLE `report` DROP FOREIGN KEY `FK_6f87884a57b3d8d504e8b6ccb80`");
        await queryRunner.query("ALTER TABLE `session` CHANGE `userId` `userId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `call` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `call` CHANGE `status` `status` int NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `call` ADD CONSTRAINT `FK_7ffd6be398e74e168de1ad7eace` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `link` CHANGE `creatorId` `creatorId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `report` CHANGE `linkId` `linkId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `report` CHANGE `userId` `userId` varchar(36) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `report` ADD CONSTRAINT `FK_6f87884a57b3d8d504e8b6ccb80` FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `link` ADD CONSTRAINT `FK_9f7e4faa3c0bb12b46a1a66ddcb` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `report` ADD CONSTRAINT `FK_e347c56b008c2057c9887e230aa` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
