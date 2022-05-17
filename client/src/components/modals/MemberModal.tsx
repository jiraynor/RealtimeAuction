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

  const [telCheck, setTelCheck] = useState<boolean>(false);

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
        if (response.status === 200) {
          dispatch(setMember(response.data));
        } else {
          setSubmitMessage('수정에 실패했습니다.');
        }
      });
  };

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
        <Modal.Title>회원정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-2">
          <Col>
            <h5>아이디 : </h5>
          </Col>
          <Col>
            <h5>{member && member.id}</h5>
          </Col>
          <Col>
            <h5>이름 : </h5>
          </Col>
          <Col>
            <h5>{member && member.name}</h5>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h5>휴대폰 번호 : </h5>
          </Col>
          <Col>
            <h5>{member && member.tel}</h5>
          </Col>
          <Col>
            <h5>이메일 : </h5>
          </Col>
          <Col>
            <h5>{member && member.email}</h5>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h5>주소 : </h5>
          </Col>
          <Col>
            <h5>{member && member.address}</h5>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <h5>계좌 번호 : </h5>
          </Col>
          <Col>
            <h5>{member && member.account_num}</h5>
          </Col>
          <Col>
            <h5>은행 : </h5>
          </Col>
          <Col>
            <h5>
              {member && member.bank_code === '003'
                ? '기업은행'
                : member && member.bank_code == '004'
                ? '국민은행'
                : '농협'}
            </h5>
          </Col>
        </Row>
        <Row className="mb-2">
          <button
            type="button"
            className="m-1 btn btn-outline-danger"
            onClick={props.onHide}
          >
            취소
          </button>
          <button
            type="button"
            className="m-1 btn btn-outline-warning"
            onClick={openUpdate}
          >
            수정
          </button>
        </Row>
        {updateShow && (
          <>
            <hr className="mb-2" />
            <Row className="mb-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="휴대폰 번호 (- 포함)"
                  value={tel}
                  onChange={onTelHandler}
                  onKeyUp={onCheckTel}
                />
              </Col>
              <Col>
                <Form.Control
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={onEmailHandler}
                />
              </Col>
            </Row>
            {telMessage && <Alert variant={'danger'}>{telMessage}</Alert>}
            <Row className="mb-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="주소"
                  value={address}
                  onChange={onAddressHandler}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="계좌번호 (숫자만)"
                  value={account_num}
                  onChange={onAccount_numHandler}
                />
              </Col>
              <Col>
                <select className="form-control" onChange={onBank_codeHandler}>
                  <option value="">은행</option>
                  <option value="003" defaultChecked={bank_code === '003'}>
                    기업은행
                  </option>
                  <option value="004" defaultChecked={bank_code === '004'}>
                    국민은행
                  </option>
                  <option value="011" defaultChecked={bank_code === '011'}>
                    농협
                  </option>
                </select>
              </Col>
            </Row>
            {submitMessage && (
              <Alert className="mb-2" variant={'danger'}>
                {submitMessage}
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeUpdate}>취소</Button>
        <Button onClick={onSubmitHandler}>수정</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberModal;
