import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

const useIdCheck = () => {
  const [idCheck, setIdCheck] = useState<boolean>(false);
  const [idCheckMessage, setIdCheckMessage] = useState<string>('');
  const idCheckingReset = () => {
    setIdCheck(false);
    setIdCheckMessage('');
  };
  const idChecking = (id: string) => {
    if (id.length === 0) {
      setIdCheckMessage('아이디를 입력하세요.');
      return;
    }
    axios
      .get(`/api/member/checkId/${id}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setIdCheck(true);
          setIdCheckMessage('사용 가능한 아이디입니다.');
        } else {
          setIdCheck(false);
          setIdCheckMessage('사용 중인 아이디입니다.');
        }
      })
      .catch((e) => {
        if (e.response.status === 503) {
          setIdCheck(false);
          setIdCheckMessage('데이터베이스 오류입니다.');
        }
      });
  };
  return { idCheck, idCheckMessage, idCheckingReset, idChecking };
};

export default useIdCheck;
