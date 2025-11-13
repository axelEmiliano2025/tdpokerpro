import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '@tdpokerpro/database';

@Injectable()
export class TournamentService {
  constructor(@InjectRepository(Tournament) private repo: Repository<Tournament>) {}
  async findAll() { return this.repo.find(); }
  async findOne(id: string) { return this.repo.findOne({ where: { id } }); }
}
