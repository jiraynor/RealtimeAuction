import AppDataSource from '../app-data-source';
import { Member } from '../entities/Member.entity';
import { signUpDto, updateDto } from '../dtos/member.dto';

export const MemberRepository = AppDataSource.getRepository(Member).extend({
  // 회원가입
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

  // 회원 정보 수정
  update(dto: updateDto) {
    console.log('라우터 : ', dto);
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

    this.save(member);

    return this.findOneBy({ id });
  },
});
