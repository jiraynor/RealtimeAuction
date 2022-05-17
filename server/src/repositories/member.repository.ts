import AppDataSource from '../app-data-source';
import { Member } from '../entities/Member.entity';
import { signUpDto, updateDto } from '../dtos/member.dto';

export const MemberRepository = AppDataSource.getRepository(Member).extend({
  signUp(dto: signUpDto) {
    const { id, password, name, address, tel, email, account_num, bank_code } =
      dto;

    const member = this.create({
      id,
      password,
      name,
      address,
      tel,
      email,
      account_num,
      bank_code,
    });

    return this.save(member);
  },

  update(dto: updateDto) {
    const { id, name, address, tel, email, account_num, bank_code } = dto;

    const member = this.create({
      id,
      name,
      address,
      tel,
      email,
      account_num,
      bank_code,
    });
  },
});
