import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'react-cookies';
import { setMember } from '../actions/member.action';
import useRefresh from './useRefresh.hook';

const useGetMember = () => {
  const dispatch = useDispatch();
  const { refresh } = useRefresh();

  const [memberShow, setMemberShow] = useState<boolean>(false);

  const memberShowReset = () => setMemberShow(false);
  const getMember = () => {
    const authToken = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    axios
      .get(`/api/member/get`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setMember(response.data));
          setMemberShow(true);
        }
      })
      .catch((e) => {
        if (e.response.status === 402) {
          refresh(getMember);
        } else if (e.response.status === 495 || e.response.status === 496)
          window.alert('다시 로그인 해주세요.');
        else if (e.response.status === 503)
          window.alert('데이터베이스 오류가 발생했습니다.');
      });
  };

  return { memberShow, memberShowReset, getMember };
};

export default useGetMember;
