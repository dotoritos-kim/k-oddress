import { ApiProperty } from "@nestjs/swagger";

export class RoadAddressDto {
  @ApiProperty({
    type: "string",
  })
  road_address_id!: string;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  road_name_code!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  admin_division_serial_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  underground_YN!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  main_building_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  sub_building_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  fundamental_district_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  change_reason_code!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  abolition_date!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  previous_road_name_address!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  detail_address_assignment_YN!: string | null;
}
