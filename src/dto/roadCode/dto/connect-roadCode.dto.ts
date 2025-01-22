import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

export class RoadCodeRoadCodeIdAdminDivisionSerialNumberUniqueInputDto {
  @ApiProperty({
    type: "string",
  })
  road_code_id!: string;
  @ApiProperty({
    type: "string",
  })
  admin_division_serial_number!: string;
}

@ApiExtraModels(RoadCodeRoadCodeIdAdminDivisionSerialNumberUniqueInputDto)
export class ConnectRoadCodeDto {
  @ApiProperty({
    type: RoadCodeRoadCodeIdAdminDivisionSerialNumberUniqueInputDto,
  })
  road_code_id_admin_division_serial_number!: RoadCodeRoadCodeIdAdminDivisionSerialNumberUniqueInputDto;
}
