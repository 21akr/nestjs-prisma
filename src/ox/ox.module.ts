import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OxService } from './ox.service';

@Module({
  imports: [HttpModule],
  providers: [OxService],
  exports: [OxService],
})
export class OxModule {}
