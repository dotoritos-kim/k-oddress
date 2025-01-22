import { ApiProperty } from "@nestjs/swagger";

export class ConnectAdditionalInformationDto {
  @ApiProperty({
    type: "string",
  })
  additional_information_id!: string;
}
