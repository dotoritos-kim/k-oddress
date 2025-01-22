import { ApiProperty } from "@nestjs/swagger";

export class StreetNumberDto {
  @ApiProperty({
    type: "string",
  })
  street_number_id!: string;
  @ApiProperty({
    type: "string",
  })
  serial_number!: string;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  legal_district_code!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  province_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  district_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  legal_town_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  legal_village_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  mountain_YN!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  land_lot_main_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  land_lot_sub_number!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  representative_YN!: string | null;
}
