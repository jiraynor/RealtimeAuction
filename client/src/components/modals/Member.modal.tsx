import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setMember } from '../../actions/member.action';

const MemberModal = (props: any) => {
  const dispatch = useDispatch();
  const member = useSelector((state: any) => state.member);

  const [address, setAddress] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [account_num, setAccount_num] = useState<string>('');
  const [bank_code, setBank_code] = useState<string>('');

  const [updateShow, setUpdateSet] = useState<boolean>(false);

  const [telMessage, setTelMessage] = useState<string>('');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const [telCheck, setTelCheck] = useState<boolean>(true);

  const onAddressHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };
  const onTelHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTel(e.currentTarget.value);
  };
  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const onAccount_numHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAccount_num(e.currentTarget.value);
  };
  const onBank_codeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setBank_code(e.currentTarget.value);
  };

  const openUpdate = () => {
    setAddress(member.address);
    setTel(member.tel);
    setEmail(member.email);
    setAccount_num(member.account_num);
    setBank_code(member.bank_code);
    setUpdateSet(true);
  };
  const closeUpdate = () => {
    setAddress('');
    setTel('');
    setEmail('');
    setAccount_num('');
    setBank_code('');
    setUpdateSet(false);
  };

  const onCheckTel = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pattern1 = /\d{3}-\d{4}-\d{4}/;
    const pattern2 = /\d{3}-\d{3}-\d{4}/;
    const pattern3 = /\d{2}-\d{3}-\d{4}/;
    const pattern4 = /\d{2}-\d{4}-\d{4}/;

    if (
      pattern1.test(tel) ||
      pattern2.test(tel) ||
      pattern3.test(tel) ||
      pattern4.test(tel)
    ) {
      setTelMessage('');
      setTelCheck(true);
      return;
    } else {
      setTelMessage('올바른 전화번호를 입력하세요.');
      setTelCheck(false);
      return;
    }
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      tel.length === 0 ||
      address.length === 0 ||
      email.length === 0 ||
      account_num.length === 0 ||
      bank_code.length === 0
    ) {
      setSubmitMessage('모든 값을 입력해주세요.');
      return;
    }

    if (!telCheck) {
      setSubmitMessage('올바른 전화번호를 입력하세요.');
      return;
    }

    const body = {
      id: member.id,
      address,
      tel,
      email,
      account_num,
      bank_code,
    };

    axios
      .patch(`/api/member/update`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) dispatch(setMember(response.data));
      })
      .catch((e) => {
        setSubmitMessage('수정에 실패했습니다.');
      });
  };

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
        <Modal.Title>회원정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 row">
          <div className="col-3 p-2 text-center">아이디 :</div>
          <div className="col-3 p-2 text-center">{member && member.id}</div>
          <div className="col-3 p-2 text-center">이름 :</div>
          <div className="col-3 p-2 text-center">{member && member.name}</div>
        </div>
        <div className="mb-2 row">
          <div className="col-3 p-2 text-center">휴대폰 번호 : </div>
          <div className="col-3 p-2 text-center">{member && member.tel}</div>
          <div className="col-3 p-2 text-center">이메일 : </div>
          <div className="col-3 p-2 text-center">{member && member.email}</div>
        </div>
        <div className="mb-2 row">
          <div className="col-3 p-2 text-center">주소 : </div>
          <div className="col-9 p-2 text-center">
            {member && member.address}
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-3 p-2 text-center">계좌 번호 : </div>
          <div className="col-3 p-2 text-center">
            {member && member.account_num}
          </div>
          <div className="col-3 p-2 text-center">은행 : </div>
          <div className="col-3 p-2 text-center">
            {member && member.bank_code === '003'
              ? '기업은행'
              : member && member.bank_code == '004'
              ? '국민은행'
              : '농협'}
          </div>
        </div>
        {!updateShow && (
          <div className="mt-4 p-2 d-flex flex-row-reverse">
            <button
              type="button"
              className="m-1 btn btn-outline-danger"
              onClick={props.onHide}
            >
              취소
            </button>
            <button
              type="button"
              className="m-1 btn btn-outline-success"
              onClick={openUpdate}
            >
              수정
            </button>
          </div>
        )}
        {updateShow && (
          <>
            <hr className="mb-2" />
            <div className="p-2 row">
              <div className="col-2 p-2 text-center">휴대폰 번호 :</div>
              <div className="col-4 p-2">
                <input
                  className="form-control"
                  type="text"
                  placeholder="휴대폰 번호 (- 포함)"
                  value={tel}
                  onChange={onTelHandler}
                  onKeyUp={onCheckTel}
                />
              </div>
              <div className="col-2 p-2 text-center">이메일 :</div>
              <div className="col-4 p-2 text-center">
                <input
                  className="form-control"
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={onEmailHandler}
                />
              </div>
            </div>
            <div className="p-2 row">
              <div className="col-2 p-2 text-center">주소 :</div>
              <div className="col-10 p-2 text-center">
                <input
                  className="form-control"
                  type="text"
                  placeholder="주소"
                  value={address}
                  onChange={onAddressHandler}
                />
              </div>
            </div>
            {telMessage && <Alert variant={'danger'}>{telMessage}</Alert>}
            <div className="p-2 row">
              <div className="col-2 p-2 text-center">계좌 번호 :</div>
              <div className="col-4 p-2">
                <input
                  className="form-control"
                  type="text"
                  placeholder="계좌번호 (숫자만)"
                  value={account_num}
                  onChange={onAccount_numHandler}
                />
              </div>
              <div className="col-2 p-2 text-center">은행 :</div>
              <div className="col-4 p-2">
                <select className="form-control" onChange={onBank_codeHandler}>
                  <option value="">은행</option>
                  <option value="003" selected={bank_code === '003'}>
                    기업은행
                  </option>
                  <option value="004" selected={bank_code === '004'}>
                    국민은행
                  </option>
                  <option value="011" selected={bank_code === '011'}>
                    농협
                  </option>
                </select>
              </div>
            </div>
            {submitMessage && (
              <Alert className="mb-2" variant={'danger'}>
                {submitMessage}
              </Alert>
            )}
            <div className="mt-4 p-2 d-flex flex-row-reverse">
              <button
                type="button"
                className="m-1 btn btn-outline-danger"
                onClick={closeUpdate}
              >
                취소
              </button>
              <button
                type="button"
                className="m-1 btn btn-outline-success"
                onClick={onSubmitHandler}
              >
                수정
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MemberModal;
