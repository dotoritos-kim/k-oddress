-- k-oddress 의 prisma/schema.prisma 를 그대로 옮긴 DDL.
-- 검색 쿼리(src/address/search/search.service.ts)가 address.road_code 처럼 부르므로 address 스키마에 둔다.
CREATE SCHEMA IF NOT EXISTS address;

DROP TABLE IF EXISTS address.additional_information, address.road_address, address.road_code, address.street_number;

CREATE TABLE address.road_code (
    road_code_id                 varchar(12) NOT NULL,
    road_name                    varchar(80),
    road_name_roman              varchar(80),
    admin_division_serial_number varchar(2)  NOT NULL,
    province_name                varchar(20),
    province_name_roman          varchar(40),
    district_name                varchar(20),
    district_name_roman          varchar(40),
    town_name                    varchar(20),
    town_name_roman              varchar(40),
    town_classification          varchar(1),
    town_code                    varchar(10),
    "usage_YN"                   varchar(1),
    change_reason                varchar(1),
    change_history               varchar(14),
    notification_date            varchar(8),
    cancellation_date            varchar(8),
    PRIMARY KEY (road_code_id, admin_division_serial_number)
);

CREATE TABLE address.road_address (
    road_address_id                varchar(25) PRIMARY KEY,
    road_name_code                 varchar(12),
    admin_division_serial_number   varchar(2),
    "underground_YN"               varchar(1),
    main_building_number           varchar(5),
    sub_building_number            varchar(5),
    fundamental_district_number    varchar(5),
    change_reason_code             varchar(2),
    abolition_date                 varchar(8),
    previous_road_name_address     varchar(25),
    "detail_address_assignment_YN" varchar(1)
);

CREATE TABLE address.street_number (
    street_number_id     varchar NOT NULL,
    serial_number        varchar NOT NULL,
    legal_district_code  varchar,
    province_name        varchar,
    district_name        varchar,
    legal_town_name      varchar,
    legal_village_name   varchar,
    "mountain_YN"        varchar,
    land_lot_main_number varchar,
    land_lot_sub_number  varchar,
    "representative_YN"  varchar,
    PRIMARY KEY (street_number_id, serial_number)
);

CREATE TABLE address.additional_information (
    additional_information_id       varchar(25) PRIMARY KEY,
    administrative_district_code    varchar(10),
    administrative_district_name    varchar(20),
    postal_code                     varchar(5),
    postal_code_serial_number       varchar(3),
    bulk_delivery_point_name        varchar(40),
    building_registry_building_name varchar(40),
    sigungu_building_name           varchar(40),
    multi_unit_housing_status       varchar(1)
);
