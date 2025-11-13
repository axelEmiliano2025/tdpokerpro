import { Controller, Get } from "@nestjs/common";
import { BlindService } from "../services/blind.service";
@Controller("blinds")
export class BlindController {
  constructor(private svc: BlindService) {}
  @Get() async findAll() { return { success: true, data: await this.svc.findAll() }; }
}
