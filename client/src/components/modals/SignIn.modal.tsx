import { useState, MouseEvent, ChangeEvent, useEffect } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';

import { useSignIn } from '../../hooks';

const SignInModal = (props: any) => {
  const { signInMessage, signInMessageReset, signIn } = useSignIn();

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onIdHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setId(e.target.value);
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setPassword(e.target.value);

  const reset = () => {
    setId('');
    setPassword('');
    signInMessageReset();
  };

  const close = () => {
    reset();
    props.onHide();
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn(id, password, close);
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
        {signInMessage && (
          <Alert className="mb-2" variant={'danger'}>
            {signInMessage}
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
