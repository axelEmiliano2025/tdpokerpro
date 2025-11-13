import { Controller, Get } from "@nestjs/common";
import { RegistrationService } from "../services/registration.service";
@Controller("registration")
export class RegistrationController {
  constructor(private svc: RegistrationService) {}
  @Get() async findAll() { return { success: true, data: await this.svc.findAll() }; }
}
