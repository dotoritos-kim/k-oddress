import { ApiProperty } from "@nestjs/swagger";

export class RoadCode {
  @ApiProperty({
    type: "string",
  })
  road_code_id!: string;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  road_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  road_name_roman!: string | null;
  @ApiProperty({
    type: "string",
  })
  admin_division_serial_number!: string;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  province_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  province_name_roman!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  district_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  district_name_roman!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  town_name!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  town_name_roman!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  town_classification!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  town_code!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  usage_YN!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  change_reason!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  change_history!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  notification_date!: string | null;
  @ApiProperty({
    type: "string",
    nullable: true,
  })
  cancellation_date!: string | null;
}
