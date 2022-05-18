import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import cookies from 'react-cookies';
import { Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setAuction } from '../../actions/auction.action';

const RegistAuctionModal = (props: any) => {
  const auction = useSelector((state: any) => state.auction);
  const dispatch = useDispatch();

  const [item_name, setItemName] = useState<string>(
    auction.auction_item.item_name
  );
  const [item_category, setItemCategory] = useState<string>(
    auction.auction_item.item_category
  );
  const [number_of_item, setNumberOfItem] = useState<number>(
    auction.auction_item.number_of_item
  );
  const [appraisal_value, setAppraisalValue] = useState<number>(
    auction.auction_item.appraisal_value
  );
  const [lowest_selling_price, setLowestSellingPrice] = useState<number>(
    auction.auction_item.lowest_selling_price
  );
  const [immediate_sale_price, setImmadiateSalePrice] = useState<number>(
    auction.auction_item.immediate_sale_price
  );
  const [item_note, setItemNote] = useState<string>(
    auction.auction_item.item_note
  );
  const [deadline, setDeadline] = useState<string>(
    auction.auction_item.deadline.substring(0, 10)
  );

  const [submitMessage, setSubmitMessage] = useState<string>('');

  const onItemNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };
  const onItemCategoryHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemCategory(e.target.value);
  };
  const onNumberOfItemHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberOfItem(parseInt(e.target.value));
  };
  const onAppraisalValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAppraisalValue(parseInt(e.target.value));
  };
  const onLowestSellingPriceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLowestSellingPrice(parseInt(e.target.value));
  };
  const onImmadiateSalePriceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setImmadiateSalePrice(parseInt(e.target.value));
  };
  const onItemNoteHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setItemNote(e.target.value);
  };
  const onDeadlineHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const onSubmitHandler = () => {
    if (
      item_name.length === 0 ||
      item_category.length === 0 ||
      number_of_item === 0 ||
      appraisal_value === 0 ||
      lowest_selling_price === 0 ||
      item_note.length === 0 ||
      deadline.length === 0
    ) {
      setSubmitMessage('최저 매각 금액을 제외한 모든 값은 필수 값입니다.');
      return;
    }

    const body = {
      auction_num: auction.auction_item.auction_num,
      item_name,
      item_category,
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      item_note,
      deadline,
      pageType: 'all',
    };

    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .patch(`/api/auction/update`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setAuction(response.data));
          props.onHide();
        }
      })
      .catch((e) => {
        if (e.response.status === 422) {
          setSubmitMessage('등록에 실패했습니다.');
        }
      });
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>경매 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">물건 이름</div>
          <div className="col-10 p-2">
            <input
              type="text"
              className="form-control text-center"
              onChange={onItemNameHandler}
              value={item_name}
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">물건 종류</div>
          <div className="col-4 p-2">
            <select
              className="form-control text-center"
              onChange={onItemCategoryHandler}
            >
              <option>선택</option>
              <option selected={item_category === 'building'} value="building">
                건물
              </option>
              <option selected={item_category === 'clothes'} value="clothes">
                옷
              </option>
            </select>
          </div>
          <div className="col-2 p-2 text-center">물건 수량</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onNumberOfItemHandler}
              value={number_of_item}
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">감정 평가 금액</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onAppraisalValueHandler}
              value={appraisal_value}
            />
          </div>
          <div className="col-2 p-2 text-center">최저 매각 금액</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onLowestSellingPriceHandler}
              value={lowest_selling_price}
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">즉시 매입 금액</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onImmadiateSalePriceHandler}
              value={immediate_sale_price}
            />
          </div>
          <div className="col-2 p-2 text-center">종료 시간</div>
          <div className="col-4 p-2 text-center">
            <input
              type="date"
              className="form-control text-center"
              onChange={onDeadlineHandler}
              value={deadline}
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-12 p-2 text-center">물건 설명</div>
        </div>
        <div className="mb-2 row">
          <div className="col-12 pl-4 pr-4">
            <textarea
              className="form-control"
              rows={5}
              minLength={5}
              onChange={onItemNoteHandler}
              value={item_note}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={props.onHide}
        >
          취소
        </button>
        <button
          type="button"
          className="btn btn-outline-warning"
          onClick={onSubmitHandler}
        >
          수정
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegistAuctionModal;
