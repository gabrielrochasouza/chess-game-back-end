import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
    @Get()
    @ApiResponse({ status: '2XX', schema: { example: { status: 'ok' } }, description: 'Check if api is still running' })
    check() {
        return { status: 'ok' };
    }
}
