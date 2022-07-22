import { Body, Post, Controller, HttpCode } from '@nestjs/common';
import { AlertGateway } from './alert.gateway';

@Controller('alert')
export class AlertController {

    constructor(private alertGateway: AlertGateway) {}

    @Post()
    @HttpCode(200)
    sendAlertToAll(@Body() dto: { message: string }) {
        this.alertGateway.sendToAll(dto.message);
        return dto;
    }
}
