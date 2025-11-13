import { Controller, Get } from "@nestjs/common";
import { PenaltyService } from "../services/penalty.service";
@Controller("penalties")
export class PenaltyController {
  constructor(private svc: PenaltyService) {}
  @Get() async findAll() { return { success: true, data: await this.svc.findAll() }; }
}
