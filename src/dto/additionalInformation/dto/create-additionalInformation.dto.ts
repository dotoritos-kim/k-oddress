import { ApiProperty } from "@nestjs/swagger";

export class CreateAdditionalInformationDto {
  @ApiProperty({
    type: "string",
  })
  additional_information_id!: string;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  administrative_district_code?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  administrative_district_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  postal_code?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  postal_code_serial_number?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  bulk_delivery_point_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  building_registry_building_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  sigungu_building_name?: string | null;
  @ApiProperty({
    type: "string",
    required: false,
    nullable: true,
  })
  multi_unit_housing_status?: string | null;
}
