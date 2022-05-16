import React, { useState, MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

const SignUpModal = (props: any) => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [account_num, setAccount_num] = useState<string>('');
  const [bank_code, setBank_code] = useState<string>('');

  const [idCheck, setIdCheck] = useState<boolean>(false);
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [password2Check, setPassword2Check] = useState<boolean>(false);
  const [telCheck, setTelCheck] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [telMessage, setTelMessage] = useState<string>('');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const onIdHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setId(e.target.value);
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setPassword(e.target.value);
  const onPassword2Handler = (e: ChangeEvent<HTMLInputElement>): void =>
    setPassword2(e.target.value);
  const onNameHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setName(e.target.value);
  const onTelHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setTel(e.target.value);
  const onAddressHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setAddress(e.target.value);
  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setEmail(e.target.value);
  const onAccount_numHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setAccount_num(e.target.value);
  const onBank_codeHandler = (e: ChangeEvent<HTMLSelectElement>): void =>
    setBank_code(e.target.value);

  const onCheckIdHandler = (e: MouseEvent<HTMLButtonElement>) => {
    axios
      .get(`/api/member/checkId/${id}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setIdCheck(true);
          setIdMessage('사용 가능한 아이디입니다.');
        } else {
          setIdCheck(false);
          setIdMessage('사용 중인 아이디입니다.');
        }
      });
  };

  const onCheckPasswordPattern = (e: KeyboardEvent<HTMLInputElement>) => {
    if (password.length < 8 || password.length > 20) {
      setPasswordMessage('비밀번호는 8자 이상 20자 이하이어야 합니다.');
      setPasswordCheck(false);
      return;
    }

    const pattern1 = /[0-9]/;
    const pattern2 = /[a-zA-Z]/;
    const pattern3 = /[!@#?_]/;

    if (
      !pattern1.test(password) ||
      !pattern2.test(password) ||
      !pattern3.test(password)
    ) {
      setPasswordMessage(
        '비밀번호는 영문자와 숫자, 특수문자(!@#?_)를 모두 포함해야 합니다.'
      );
      setPasswordCheck(false);
      return;
    }

    setPasswordMessage('');
    setPasswordCheck(true);
  };

  const onCheckPasswordConfirm = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (passwordCheck && password === password2) {
      setPasswordMessage('');
      setPassword2Check(true);
      return;
    } else {
      setPasswordMessage('비밀번호가 불일치 합니다.');
      setPassword2Check(false);
      return;
    }
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

  const reset = () => {
    setId('');
    setPassword('');
    setPassword2('');
    setName('');
    setTel('');
    setAddress('');
    setEmail('');
    setAccount_num('');
    setBank_code('');
    setIdCheck(false);
    setPasswordCheck(false);
    setPassword2Check(false);
    setTelCheck(false);
    setIdMessage('');
    setPasswordMessage('');
    setTelMessage('');
    setSubmitMessage('');
  };

  const close = () => {
    reset();
    props.onHide();
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    // 기본 이벤트 제거
    e.preventDefault();

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
      setSubmitMessage('모든 값을 입력해주세요.');
      return;
    }

    if (!idCheck) {
      setSubmitMessage('아이디 중복체크를 해주세요.');
      return;
    }

    if (!passwordCheck) {
      setSubmitMessage('비밀번호 조건이 충족되지 않았습니다.');
      return;
    }

    if (!password2Check) {
      setSubmitMessage('비밀번호가 서로 다릅니다.');
      return;
    }

    if (!telCheck) {
      setSubmitMessage('올바른 전화번호를 입력하세요.');
      return;
    }

    const body = {
      id,
      password,
      name,
      address,
      tel,
      email,
      account_num,
      bank_code,
    };

    axios
      .post(`/api/member/signUp`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          close();
        } else {
          setSubmitMessage('회원가입에 실패했습니다.');
        }
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="아이디"
              onChange={onIdHandler}
            />
          </Col>
          <Col>
            <button
              className="btn btn-outline-success btn-block"
              type="button"
              onClick={onCheckIdHandler}
            >
              중복체크
            </button>
          </Col>
        </Row>
        {idMessage && (
          <Alert className="mb-2" variant={'success'}>
            {idMessage}
          </Alert>
        )}
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              onChange={onPasswordHandler}
              onKeyUp={onCheckPasswordPattern}
            />
          </Col>
          <Col>
            <Form.Control
              type="password"
              placeholder="비밀번호 확인"
              onChange={onPassword2Handler}
              onKeyUp={onCheckPasswordConfirm}
            />
          </Col>
        </Row>
        {passwordMessage && (
          <Alert className="mb-2" variant={'danger'}>
            {passwordMessage}
          </Alert>
        )}
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="이름"
              onChange={onNameHandler}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="휴대폰 번호 (- 포함)"
              onChange={onTelHandler}
              onKeyUp={onCheckTel}
            />
          </Col>
        </Row>
        {telMessage && <Alert variant={'danger'}>{telMessage}</Alert>}
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="주소"
              onChange={onAddressHandler}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="email"
              placeholder="이메일 주소"
              onChange={onEmailHandler}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="계좌번호 (숫자만)"
              onChange={onAccount_numHandler}
            />
          </Col>
          <Col>
            <select className="form-control" onChange={onBank_codeHandler}>
              <option value="">은행</option>
              <option value="003">기업은행</option>
              <option value="004">국민은행</option>
              <option value="011">농협</option>
            </select>
          </Col>
        </Row>
        {submitMessage && (
          <Alert className="mb-2" variant={'danger'}>
            {submitMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>취소</Button>
        <Button onClick={onSubmitHandler}>가입</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;