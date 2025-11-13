import { Controller, Get } from "@nestjs/common";
import { SeatingService } from "../services/seating.service";
@Controller("seating")
export class SeatingController {
  constructor(private svc: SeatingService) {}
  @Get() async findAll() { return { success: true, data: await this.svc.findAll() }; }
}
