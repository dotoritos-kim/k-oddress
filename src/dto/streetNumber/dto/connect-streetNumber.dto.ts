import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

export class StreetNumberStreetNumberIdSerialNumberUniqueInputDto {
  @ApiProperty({
    type: "string",
  })
  street_number_id!: string;
  @ApiProperty({
    type: "string",
  })
  serial_number!: string;
}

@ApiExtraModels(StreetNumberStreetNumberIdSerialNumberUniqueInputDto)
export class ConnectStreetNumberDto {
  @ApiProperty({
    type: StreetNumberStreetNumberIdSerialNumberUniqueInputDto,
  })
  street_number_id_serial_number!: StreetNumberStreetNumberIdSerialNumberUniqueInputDto;
}
