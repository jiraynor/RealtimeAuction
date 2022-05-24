import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

const useSignUp = () => {
  const [signUpMessage, setSignUpMessage] = useState<string>('');
  const signUpMessageReset = () => setSignUpMessage('');
  const signUp = (body: any, checked: any, close: Function) => {
    const {
      id,
      password,
      password2,
      name,
      tel,
      address,
      email,
      account_num,
      bank_code,
    } = body;

    const { idCheck, passwordCheck, password2Check, telCheck } = checked;

    console.log(
      id,
      password,
      password2,
      name,
      tel,
      address,
      email,
      account_num,
      bank_code
    );

    if (
      id.length === 0 ||
      password.length === 0 ||
      password2.length === 0 ||
      name.length === 0 ||
      tel.length === 0 ||
      address.length === 0 ||
      email.length === 0 ||
      account_num.length === 0 ||
      bank_code.length === 0
    ) {
      setSignUpMessage('모든 값을 입력해주세요.');
      return;
    }

    if (!idCheck) {
      setSignUpMessage('아이디 중복체크를 해주세요.');
      return;
    }

    if (!passwordCheck) {
      setSignUpMessage('비밀번호 조건이 충족되지 않았습니다.');
      return;
    }

    if (!password2Check) {
      setSignUpMessage('비밀번호가 서로 다릅니다.');
      return;
    }

    if (!telCheck) {
      setSignUpMessage('올바른 전화번호를 입력하세요.');
      return;
    }

    axios
      .post(`/api/member/signUp`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) close();
      })
      .catch((e) => {
        if (e.response.status === 422)
          setSignUpMessage('존재하는 아이디입니다.');
        if (e.response.status === 503)
          setSignUpMessage('데이터베이스 오류입니다.');
      });
  };

  return { signUpMessage, signUpMessageReset, signUp };
};

export default useSignUp;
