import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoadAddressDto {
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  road_name_code?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  admin_division_serial_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  underground_YN?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  main_building_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  sub_building_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  fundamental_district_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  change_reason_code?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  abolition_date?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  previous_road_name_address?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  detail_address_assignment_YN?: string | null;
}
