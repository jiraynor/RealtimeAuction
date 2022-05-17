import AppDataSource from '../app-data-source';
import { DataSource, Entity, EntityRepository, Repository } from 'typeorm';
import { Member } from '../entities/Member.entity';
import { signUpDto } from '../dtos/member.dto';

export const MemberRepository = AppDataSource.getRepository(Member).extend({
  signUp(dto: signUpDto) {
    const { id, password, name, address, tel, email, account_num, bank_code } =
      dto;
    return this.createQueryBuilder('Member')
      .insert()
      .into(Member)
      .values({
        id,
        password,
        name,
        address,
        tel,
        email,
        account_num,
        bank_code,
      })
      .execute();
  },
});
