import React, { useState, MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';

import axios, { AxiosResponse } from 'axios';
import { useIdCheck, useSignUp } from '../../hooks';

const SignUpModal = (props: any) => {
  const { signUpMessage, signUpMessageReset, signUp } = useSignUp();
  const { idCheck, idCheckMessage, idCheckingReset, idChecking } = useIdCheck();

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [account_num, setAccount_num] = useState<string>('');
  const [bank_code, setBank_code] = useState<string>('');

  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [password2Check, setPassword2Check] = useState<boolean>(false);
  const [telCheck, setTelCheck] = useState<boolean>(false);

  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [telMessage, setTelMessage] = useState<string>('');

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

  const onCheckIdHandler = () => idChecking(id);
  const onCheckPasswordPattern = (e: KeyboardEvent<HTMLInputElement>) => {
    if (password.length < 8 || password.length > 20) {
      setPasswordMessage('??????????????? 8??? ?????? 20??? ??????????????? ?????????.');
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
        '??????????????? ???????????? ??????, ????????????(!@#?_)??? ?????? ???????????? ?????????.'
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
      setPasswordMessage('??????????????? ????????? ?????????.');
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
      setTelMessage('????????? ??????????????? ???????????????.');
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
    setPasswordCheck(false);
    setPassword2Check(false);
    setTelCheck(false);
    setPasswordMessage('');
    setTelMessage('');
    idCheckingReset();
    signUpMessageReset();
  };

  const close = () => {
    reset();
    props.onHide();
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    // ?????? ????????? ??????
    e.preventDefault();

    const body = {
      id,
      password,
      password2,
      name,
      tel,
      address,
      email,
      account_num,
      bank_code,
    };

    const checked = { idCheck, passwordCheck, password2Check, telCheck };

    signUp(body, checked, close);
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>????????????</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="?????????"
              onChange={onIdHandler}
              readOnly={idCheck}
            />
          </Col>
          <Col>
            <button
              className="btn btn-outline-success btn-block"
              type="button"
              onClick={onCheckIdHandler}
              disabled={idCheck}
            >
              ????????????
            </button>
          </Col>
        </Row>
        {idCheckMessage && (
          <Alert className="mb-2" variant={'success'}>
            {idCheckMessage}
          </Alert>
        )}
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="password"
              placeholder="????????????"
              onChange={onPasswordHandler}
              onKeyUp={onCheckPasswordPattern}
            />
          </Col>
          <Col>
            <Form.Control
              type="password"
              placeholder="???????????? ??????"
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
              placeholder="??????"
              onChange={onNameHandler}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="????????? ?????? (- ??????)"
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
              placeholder="??????"
              onChange={onAddressHandler}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="email"
              placeholder="????????? ??????"
              onChange={onEmailHandler}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="???????????? (?????????)"
              onChange={onAccount_numHandler}
            />
          </Col>
          <Col>
            <select className="form-control" onChange={onBank_codeHandler}>
              <option value="">??????</option>
              <option value="003">????????????</option>
              <option value="004">????????????</option>
              <option value="011">??????</option>
            </select>
          </Col>
        </Row>
        {signUpMessage && (
          <Alert className="mb-2" variant={'danger'}>
            {signUpMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close}>??????</Button>
        <Button onClick={onSubmitHandler}>??????</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;
