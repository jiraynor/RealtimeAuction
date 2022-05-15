import React, { useState, MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

const WalletModal = (props: any) => {
  const [id, setId] = useState<string>(props.id);
  const [amount, setAmount] = useState<number>(0);

  const [transactionMessage, setTransactionMessage] = useState<string>('');

  const onAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setAmount(parseInt(value));
  };

  const depositHandler = () => {
    const body = {
      id,
      amount,
    };
    axios
      .post(`/api/member/deposit`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          props.setBalance(response.data);
        } else {
          setTransactionMessage('입금에 실패했습니다.');
          return;
        }
      });
  };

  const withdrawalHandler = () => {
    const body = {
      amount,
    };
    axios
      .post(`/api/member/withdrawal`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          props.setBalance(response.data);
        } else {
          setTransactionMessage('출금에 실패했습니다.');
          return;
        }
      });
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>{id}님의 지갑</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>출금 가능 금액: {props.balance} 원</h4>
        <Row className="mb-2">
          <Col sx="4">
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="금액"
              />
              <div className="input-group-append">
                <span className="input-group-text">원</span>
              </div>
            </div>
          </Col>
          <Col className="p-1">
            <button
              type="button"
              className="btn btn-outline-info btn-block"
              onClick={depositHandler}
            >
              입금
            </button>
          </Col>
          <Col className="p-1">
            <button
              type="button"
              className="btn btn-outline-danger btn-block"
              onClick={withdrawalHandler}
            >
              출금
            </button>
          </Col>
        </Row>
        {transactionMessage && (
          <Alert className="mb-2" variant={'success'}>
            {transactionMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WalletModal;
