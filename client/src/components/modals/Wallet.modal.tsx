import { useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cookies from 'react-cookies';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';

import axios, { AxiosResponse } from 'axios';

import { setBalance } from '../../actions/balance.action';
import { getRefreshToken } from '../../reducers/refresh-token.reducer';

const WalletModal = (props: any) => {
  const dispatch = useDispatch();
  const cookie_member = useSelector((state: any) => state.cookie_member);
  const balance = useSelector((state: any) => state.balance);

  const [amount, setAmount] = useState<number>(0);

  const [transactionMessage, setTransactionMessage] = useState<string>('');

  const onAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setAmount(parseInt(value));
  };

  const depositHandler = () => {
    if (amount < 0) {
      setTransactionMessage('음수 값은 입금 하실수 없습니다.');
      return;
    }

    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .post(`/api/member/deposit`, { amount })
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          const { balance } = response.data;
          dispatch(setBalance({ balance }));
        }
      })
      .catch((e) => {
        if (e.response.status === 422)
          setTransactionMessage(getRefreshToken(cookie_member.id) + '');
        else setTransactionMessage('입금에 실패했습니다.');
      });
  };

  const withdrawalHandler = () => {
    if (amount < 0) {
      setTransactionMessage('음수 값은 출금 하실수 없습니다.');
      return;
    }
    if (amount > balance.balance) {
      setTransactionMessage('소유한 금액보다 큰 금액은 출금 하실수 없습니다.');
      return;
    }

    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .post(`/api/member/withdrawal`, { amount })
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          const { balance } = response.data;
          dispatch(setBalance({ balance }));
        }
      })
      .catch((e) => {
        if (e.response.status === 422)
          setTransactionMessage(getRefreshToken(cookie_member.id) + '');
        else setTransactionMessage('출금에 실패했습니다.');
      });
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>{cookie_member.id}님의 지갑</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>출금 가능 금액: {balance.balance} 원</h4>
        <Row className="mb-2">
          <Col sx="4">
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="금액"
                onChange={onAmountHandler}
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
