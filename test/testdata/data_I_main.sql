-- TRUNCATE TABLE `link`;
-- TRUNCATE TABLE `call`;
-- TRUNCATE TABLE `report`;
--



-- ###############
-- # CREATE LINK #
-- ###############

-- ---------
-- DEFAULT -
-- ---------
-- User with ID f406c1a0-ea46-4229-a83e-bba9b5d2f313

-- --------------------
-- FOR FAILURE - AUTH -
-- --------------------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('07ce868f-a293-46be-afd1-1e3e2b38b691', 'test-createlink-existingshort-short', 'https://dein.li', 1, '2021-02-07 12:59:00.596617', NULL);
COMMIT;




-- ################
-- # GET BY SHORT #
-- ################

-- ---------
-- DEFAULT -
-- ---------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('8ffefe3c-5530-4e7a-b2b7-16f4a2220289', 'test-getbyshort-short', 'https://dein.li', 1, '2021-02-06 18:38:17.000000', NULL);
COMMIT;




-- ##################
-- # CREATE VERSION #
-- ##################

-- ---------
-- DEFAULT -
-- ---------
-- User with ID 1e0ff072-8fa5-4ba1-92ea-738901cdfd8e
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('1b651bc0-84d7-4708-b5d5-c00abd41563d', 'test-createversion-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', '1e0ff072-8fa5-4ba1-92ea-738901cdfd8e');
COMMIT;

-- ---------------------
-- MISSING PERMISSIONS -
-- ---------------------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('0b29ed38-cab7-48db-920c-c7166cfd2a8f', 'test-createversion-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:23:22.000000', NULL);
COMMIT;

-- ----------------
-- BY PERMISSIONS -
-- ----------------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('ddd71257-2dc0-493c-a09a-8ed260cbcd87', 'test-createversion-bypermission-short', 'https://dein.li', 1, '2021-02-13 19:23:22.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('d99174ae-26bb-40e3-83f3-0ac1eeaa331f', 'sFmk9Jevui6h8GsGcNBwJXKOSZlceuhx', '2021-02-13 19:04:51.000000', 'ddd71257-2dc0-493c-a09a-8ed260cbcd87', 'test-createversion-bypermission-comment', '2021-02-13 19:04:51.000000');
COMMIT;






-- #####################
-- # GET LINK VERSIONS #
-- #####################

-- ---------
-- DEFAULT -
-- ---------
-- User with ID 15056b7c-4d16-4ed1-8862-3e7ae57a0819
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('3941d3af-f7ec-4674-8ba6-4d596b0c6844', 'test-getversions-short', 'https://version1.dein.li', -1, '2021-02-08 18:56:35.000000', '15056b7c-4d16-4ed1-8862-3e7ae57a0819'),
('88e11b8f-1052-49aa-afe4-52e65e41f27e', 'test-getversions-short', 'https://version2.dein.li', -1, '2021-02-09 18:56:35.000000', '15056b7c-4d16-4ed1-8862-3e7ae57a0819'),
('cc5701aa-7116-4ca9-a310-b2703440a70e', 'test-getversions-short', 'https://version3.dein.li', -1, '2021-02-10 18:57:53.000000', '15056b7c-4d16-4ed1-8862-3e7ae57a0819'),
('d374ce65-6672-4227-bc9f-38ada6ff5664', 'test-getversions-short', 'https://version4.dein.li', 1, '2021-02-11 18:57:53.000000', '15056b7c-4d16-4ed1-8862-3e7ae57a0819'),
('254ae520-6b97-42ec-ac06-14414df5e4e7', 'test-getversions-missingpermissions-short', 'https://version1.dein.li', 1, '2021-02-08 18:56:35.000000', NULL),
('e54b01d7-e5f1-443f-9a47-619c12463ea6', 'test-getversions-bypermission-short', 'https://version1.dein.li', 1, '2021-02-08 18:56:35.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('e54b01d7-e5f1-443f-9a47-619c12463ea6', 'FF3wNlsszCRqSlwczVXwZUS3ZlUIikdF', '2021-02-13 19:04:51.000000', '8420bb51-adb6-4766-aeed-c00d4b0cf657', 'test-updatepermission-bypermission-comment', '2021-02-13 19:04:51.000000');
COMMIT;



-- #######################
-- # GET LINK STATISTICS #
-- #######################

-- ---------
-- DEFAULT -
-- ---------
-- User with ID a78c256d-d476-4d3d-b443-a6fd9b46f3b6
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('1453b814-b4d2-4c20-91b4-7bbf521c5cef', 'test-getstatistics-short', 'https://dein.li', 1, '2021-02-14 00:27:51.000000', 'a78c256d-d476-4d3d-b443-a6fd9b46f3b6');
COMMIT;




-- #############
-- # GET LINKS #
-- #############

-- ---------
-- DEFAULT -
-- ---------
-- User with ID 35911778-8a21-4aa7-bd92-13c8b7bac3ce
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('5d878952-fefa-4fed-bf9a-21dd21720675', 'test-getlinks-1-short', 'https://dein.li', 1, '2021-01-01 00:00:00.000000', '35911778-8a21-4aa7-bd92-13c8b7bac3ce'),
('f434e6d9-0947-4573-ab0a-6da322833c20', 'test-getlinks-2-short', 'https://dein.li', 1, '2021-01-02 00:00:00.000000', '35911778-8a21-4aa7-bd92-13c8b7bac3ce'),
('b865cc8f-4fbc-4e91-8702-4144ffed4675', 'test-getlinks-3-short', 'https://dein.li', 1, '2021-01-03 00:00:00.000000', '35911778-8a21-4aa7-bd92-13c8b7bac3ce'),
('4e5164ca-6603-4211-862f-e852aa098e92', 'test-getlinks-4-short', 'https://dein.li', 1, '2021-01-04 00:00:00.000000', '35911778-8a21-4aa7-bd92-13c8b7bac3ce'),
('a9bb860a-5d8d-4e54-bc3c-43eed19bd30a', 'test-getlinks-5-short', 'https://dein.li', 1, '2021-01-05 00:00:00.000000', '35911778-8a21-4aa7-bd92-13c8b7bac3ce');
COMMIT;
-- CALLS -> ADDITIONAL SQL FILES





-- #########################
-- # GET STATISTICS GLOBAL #
-- #########################

-- ---------
-- DEFAULT -
-- ---------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('f03ed0e8-c82e-403e-b4d0-e4c69855e3e9', 'test-noise-1-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('f2a94f4b-86b0-4e2a-b43d-d7e3ba9abb07', 'test-noise-2-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('a0d60634-1c52-4db0-8187-8080810c3955', 'test-noise-3-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('26ebf573-2384-4add-abee-ac38e5b33c6f', 'test-noise-4-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('c85f4b4d-43a9-4d3c-8046-eed078859bf7', 'test-noise-5-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('8f57ed38-f76d-4ef8-b6e6-294315c30825', 'test-noise-6-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('2621589e-18d7-45a6-8976-0131ec08d6c0', 'test-noise-7-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('cb2b0a64-7a11-4893-9379-3b37ada01894', 'test-noise-8-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('b494e5f0-add5-46d1-b05e-f8ab1e63856b', 'test-noise-9-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL),
('7057c92b-6b76-4849-9c55-d48c999eb251', 'test-noise-10-short', 'https://dein.li', 1, '2020-01-01 00:00:00.000000', NULL);
COMMIT;
-- CALLS -> ADDITIONAL SQL FILES




-- #####################
-- # CREATE PERMISSION #
-- #####################

-- ---------
-- DEFAULT -
-- ---------
-- User with ID 2b95cb31-109b-4b26-9698-1f43d5ef73dc
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('f65dc645-b269-4a08-9da9-c7161efbe329', 'test-createpermission-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', '2b95cb31-109b-4b26-9698-1f43d5ef73dc');
COMMIT;
-- ---------------------
-- MISSING PERMISSIONS -
-- ---------------------
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('2b311297-3c94-4cd9-b97e-6eaaf020d80d', 'test-createpermission-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', NULL);
COMMIT;



-- ###################
-- # GET PERMISSIONS #
-- ###################
-- User with ID 2a982e51-2dc9-4b0a-9cdc-a95c36ae63c7
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('33d8cb83-b0fe-41fb-b56d-5e30fb2fb0f3', 'test-getpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', '2a982e51-2dc9-4b0a-9cdc-a95c36ae63c7'),
('cc6e566b-41c3-4839-833e-45515fdbaaf8', 'test-getpermissions-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('9124656d-1105-44d4-be98-858cd2dcadda', 'zeVnv0mlkBUqiGCNUdFaNrNMKEN758yw', '2021-02-13 19:04:51.000000', '33d8cb83-b0fe-41fb-b56d-5e30fb2fb0f3', 'test-getpermissions-comment-1', '2021-02-13 19:04:51.000000'),
('40c1d171-e454-4d35-9f96-63ac0b9759fc', 'i0WVRSepWf9NZlvb9TZrYLpjjmSXpd8s', '2021-02-13 19:04:51.000000', '33d8cb83-b0fe-41fb-b56d-5e30fb2fb0f3', 'test-getpermissions-comment-1', '2021-02-13 19:04:51.000000');
COMMIT;



-- ##################
-- # GET PERMISSION #
-- ##################
-- User with ID ffe48772-6193-482b-b3cf-09b8dddcfc0a
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('d3f1994d-64a9-4999-b854-b41ea773a0c9', 'test-getpermission-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', 'ffe48772-6193-482b-b3cf-09b8dddcfc0a'),
('a725dbf7-ff5f-489e-8ce3-637f34bd1e49', 'test-getpermission-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('5f2bc8b3-8904-4afc-8d74-eb1175bd85c7', 'tt0OsmVteoz9CnrkyCh8aw7nFLfyZq3T', '2021-02-13 19:04:51.000000', 'd3f1994d-64a9-4999-b854-b41ea773a0c9', 'test-getpermission-comment', '2021-02-13 19:04:51.000000'),
('8306a4e7-8057-4242-b8ea-66ecedd03d11', 'GeLnSyhqHjRig2lkwmDV4tB6Bur1xyOi', '2021-02-13 19:04:51.000000', 'a725dbf7-ff5f-489e-8ce3-637f34bd1e49', 'test-getpermission-missingpermissions-comment', '2021-02-13 19:04:51.000000');
COMMIT;


-- #####################
-- # UPDATE PERMISSION #
-- #####################
-- User with ID 5ccce0ac-bfc0-421a-aa6a-ece561c420f8
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('8420bb51-adb6-4766-aeed-c00d4b0cf657', 'test-updatepermission-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', '5ccce0ac-bfc0-421a-aa6a-ece561c420f8'),
('28622b2d-3621-49f8-9761-5e8adc79f09a', 'test-updatepermission-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('bdd82c65-2c7d-4da5-aca6-2792fb8bbf48', 'G9fIZhCgPXwFmEv97kM8Se5eItGVbMsf', '2021-02-13 19:04:51.000000', '8420bb51-adb6-4766-aeed-c00d4b0cf657', 'test-updatepermission-comment', '2021-02-13 19:04:51.000000'),
('d5ed35cf-9964-482a-af9f-23fc3f69013a', 'svfBLL7aUgfzrZQOJA9cDe8JMBahqhRu', '2021-02-13 19:04:51.000000', '28622b2d-3621-49f8-9761-5e8adc79f09a', 'test-updatepermission-missingpermissions-comment', '2021-02-13 19:04:51.000000');
COMMIT;





-- #####################
-- # DELETE PERMISSION #
-- #####################
-- User with ID 12a0a71a-c6d4-4db2-be5f-97630ffe1246
INSERT INTO `link` (`id`, `short`, `original`, `isActive`, `iat`, `creatorId`) VALUES
('2e18c6a9-58cf-4224-ba8e-5b30abb9aa90', 'test-deletepermission-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', '12a0a71a-c6d4-4db2-be5f-97630ffe1246'),
('b8713cbb-40a4-4fd4-a10c-11ef799cedf3', 'test-deletepermission-missingpermissions-short', 'https://dein.li', 1, '2021-02-13 19:04:51.000000', NULL);
COMMIT;

INSERT INTO `link_permission` (`id`, `token`, `iat`, `linkId`, `comment`, `expiration`) VALUES
('c2df69e1-0a52-40cf-83c4-f3f93e2d43eb', 'iRtuJiXmnEvvLuBodK6IDZSJeGTlv6sh', '2021-02-13 19:04:51.000000', 'b8713cbb-40a4-4fd4-a10c-11ef799cedf3', 'test-deletepermission-missingpermissions-comment', '2021-02-13 19:04:51.000000');
COMMIT;




