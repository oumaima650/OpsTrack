import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';

export class FilterIncidentDto {
  @ApiProperty({ enum: IncidentStatus, required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({ enum: IncidentSeverity, required: false })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiProperty({ description: 'Search term for title or description', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
