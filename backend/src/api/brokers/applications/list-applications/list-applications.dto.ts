import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Application } from 'src/models/applications/application.entity';
import { ApplicationStatus } from 'src/enums/application-status.enum';
import {
  INVALID_MAXIMUM_DATE_ERROR,
  INVALID_MINIMUM_DATE_ERROR,
  MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR,
} from 'src/common/constants/response-messages';
import { Allow, IsArray, IsDate, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SuccessResponseDto } from 'src/common/responses';
import { TaskStatus } from 'src/enums/task-status.enum';
import { Transform, Type } from 'class-transformer';

/**
 * Querystring parameters for listing applications
 */
export class BrokerApplicationsListRequestDto {
  /**
   * Optional flag for application status
   */
  @ApiPropertyOptional({
    description: 'Optional flag for application status',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
  })
  @IsArray()
  @IsEnum(ApplicationStatus, { each: true })
  @IsOptional()
  readonly status?: ApplicationStatus[];
  /**
   * Optional flag for applications with incomplete tasks
   */
  @ApiPropertyOptional({
    description: 'Optional flag for applications with incomplete tasks',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly completed?: TaskStatus.Completed | TaskStatus.Pending;
  /**
   * Optional minimum date for the application submission
   */
  @ApiPropertyOptional({
    description: 'Minimum date for the application submission',
  })
  @Transform(({ value }) => (value && !isNaN(value) ? value : null))
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly minimumDate?: Date;
  /**
   * Optional maximum date for the application submission
   */
  @ApiPropertyOptional({
    description: 'Maximum date for the application submission',
  })
  @Transform(({ value }) => (value && !isNaN(value) ? value : null))
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly maximumDate?: Date;
}

export class ApplicationDto extends PickType(Application, [
  'applicantName',
  'applicantEmail',
  'applicantMobilePhoneNumber',
  'applicantAddress',
  'annualIncomeBeforeTax',
  'incomingAddress',
  'incomingDeposit',
  'incomingPrice',
  'incomingStampDuty',
  'loanAmount',
  'loanDuration',
  'monthlyExpenses',
  'outgoingAddress',
  'outgoingMortgage',
  'outgoingValuation',
  'savingsContribution'
]) { 
  @ApiProperty({ description: "The applicant's name" })
  @IsNotEmpty()
  @IsString()
  applicantName: string;

  @ApiProperty({ description: "The applicant's email address" })
  @IsNotEmpty()
  @IsEmail()
  applicantEmail: string;

  @ApiProperty({ description: "The applicant's mobile phone number" })
  @IsNotEmpty()
  @IsMobilePhone()
  applicantMobilePhoneNumber: string;

  @ApiProperty({ description: "The applicant's address" })
  @IsNotEmpty()
  @IsString()
  applicantAddress: string;

  @ApiProperty({ description: "The applicant's annual income before tax in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  annualIncomeBeforeTax: number;

  @ApiProperty({ description: "The incoming property address" })
  @IsNotEmpty()
  @IsString()
  incomingAddress: string;

  @ApiProperty({ description: "The deposit paid on the incoming property in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  incomingDeposit: number;

  @ApiProperty({ description: "The purchase price of the incoming property in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  incomingPrice: number;

  @ApiProperty({ description: "The stamp duty to be paid on the incoming property in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  incomingStampDuty: number;

  @ApiProperty({ description: "The loan amount in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  loanAmount: number;

  @ApiProperty({ description: "The duration of the loan in months" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  loanDuration: number;

  @ApiProperty({ description: "The applicant's monthly expenses in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  monthlyExpenses: number;

  @ApiProperty({ description: "The outgoing property address" })
  @IsNotEmpty()
  @IsString()
  outgoingAddress: string;

  @ApiProperty({ description: "The remaining mortgage if any on the outgoing property in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  outgoingMortgage: number;

  @ApiProperty({ description: "The outgoing property valuation in dollars" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  outgoingValuation: number;

  @ApiProperty({ description: "The applicant's savings put towards the loan in dollars" })
  
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  savingsContribution: number;
}

export class BrokerApplicationPostResponseDto extends SuccessResponseDto {
  readonly loanAmount: number
}

class BrokerApplicationDto extends PickType(Application, [
  'id',
  'applicationId',
  'createdAt',
  'status',
  'loanAmount',
  'loanDuration',
  'applicantName',
  'incomingAddress',
  'outgoingAddress',
]) { }

/**
 * The response data
 */
export class BrokerApplicationsListResponseDto extends SuccessResponseDto {
  /**
   * The broker's applications
   */
  readonly applications: BrokerApplicationDto[];
}

/**
 * Error codes this endpoint can return
 */
const BAD_REQUEST_ERRORS = [
  INVALID_MINIMUM_DATE_ERROR,
  INVALID_MAXIMUM_DATE_ERROR,
  MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR,
];

/**
 * The response data when an error code is returned
 */
export class BrokerApplicationsListBadRequestResponseDto {
  /**
   * Failure message and reason
   */
  @ApiProperty({
    description: 'Failure message and reason',
    enum: BAD_REQUEST_ERRORS,
  })
  @IsEnum(BAD_REQUEST_ERRORS)
  readonly message: string;
}
