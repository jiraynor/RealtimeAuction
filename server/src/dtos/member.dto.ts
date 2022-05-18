// 회원가입
export class signUpDto {
  id: string;
  password: string;
  name: string;
  address: string;
  tel: string;
  email: string;
  account_num: string;
  bank_code: string;
}

// 회원정보 수정
export class updateDto {
  id: string;
  name: string;
  address: string;
  tel: string;
  email: string;
  account_num: string;
  bank_code: string;
}
