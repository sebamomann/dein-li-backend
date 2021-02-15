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
('d374ce65-6672-4227-bc9f-38ada6ff5664', 'test-getversions-short', 'https://version4.dein.li', 1, '2021-02-11 18:57:53.000000', '15056b7c-4d16-4ed1-8862-3e7ae57a0819');
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
