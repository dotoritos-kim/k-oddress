import { ApiProperty } from "@nestjs/swagger";

export class ConnectRoadAddressDto {
  @ApiProperty({
    type: "string",
  })
  road_address_id!: string;
}
