import { ApiProperty } from "@nestjs/swagger";

export class UpdateStreetNumberDto {
  @ApiProperty({
    type: "string",
    required: false,
  })
  street_number_id?: string;
  @ApiProperty({
    type: "string",
    required: false,
  })
  serial_number?: string;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  legal_district_code?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  province_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  district_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  legal_town_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  legal_village_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  mountain_YN?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  land_lot_main_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  land_lot_sub_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  representative_YN?: string | null;
}
