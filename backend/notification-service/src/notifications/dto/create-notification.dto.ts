import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the related incident', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  incidentId: string;

  @ApiProperty({ description: 'Type of event/notification', example: 'INCIDENT_CREATED' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Message detailing the notification', example: 'New critical incident reported: High CPU load' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Optional recipient or channel metadata', example: 'ops-team-slack', required: false })
  @IsOptional()
  @IsString()
  recipient?: string;
}
