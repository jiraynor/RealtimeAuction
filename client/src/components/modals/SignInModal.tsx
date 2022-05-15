import React, { useState, MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

const SignInModal = (props: any) => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [submitMessage, setSubmitMessage] = useState<string>('');

  const onIdHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setId(e.target.value);
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setPassword(e.target.value);

  const reset = () => {
    setId('');
    setPassword('');
    setSubmitMessage('');
  };

  const close = () => {
    reset();
    props.onHide();
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    // 기본 이벤트 제거
    e.preventDefault();

    if (id.length === 0 || password.length === 0) {
      setSubmitMessage('모든 값을 입력해주세요.');
      return;
    }

    const body = {
      id,
      password,
    };

    axios
      .post(`/api/member/signIn`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          props.setStatus(true);
          close();
        } else {
          setSubmitMessage('로그인 정보가 일치하지 않습니다.');
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
        <Modal.Title>로그인</Modal.Title>
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
        </Row>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              onChange={onPasswordHandler}
            />
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
        <Button onClick={onSubmitHandler}>로그인</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignInModal;
