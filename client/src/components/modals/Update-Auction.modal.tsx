import { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'react-cookies';
import { Modal } from 'react-bootstrap';

import axios, { AxiosResponse } from 'axios';

import { setAuction } from '../../actions/auction.action';
import { getRefreshToken } from '../../reducers/refresh-token.reducer';

const RegistAuctionModal = (props: any) => {
  const dispatch = useDispatch();

  const auction = useSelector((state: any) => state.auction);
  const cookie_member = useSelector((state: any) => state.cookie_member);

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

  const close = () => {
    setItemName('');
    setItemCategory('');
    setNumberOfItem(0);
    setAppraisalValue(0);
    setLowestSellingPrice(0);
    setImmadiateSalePrice(0);
    setItemNote('');
    setDeadline('');
    props.onHide();
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
      setSubmitMessage('?????? ?????? ????????? ????????? ?????? ?????? ?????? ????????????.');
      return;
    }

    if (
      number_of_item < 1 ||
      appraisal_value < 1 ||
      lowest_selling_price < 1 ||
      immediate_sale_price < 0
    ) {
      setSubmitMessage('?????? ??? ????????? 1 ????????? ?????? ????????? ??? ????????????.');
      return;
    }

    if (
      immediate_sale_price > 0 &&
      lowest_selling_price >= immediate_sale_price
    ) {
      setSubmitMessage('?????? ?????? ????????? ?????? ?????? ???????????? ?????? ?????????.');
      return;
    }

    if (new Date(deadline) <= new Date()) {
      setSubmitMessage('???????????? ?????? ??????????????? ?????????.');
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
          close();
        }
      })
      .catch((e) => {
        if (e.response.status === 422)
          setSubmitMessage(getRefreshToken(cookie_member.id) + '');
        else setSubmitMessage('????????? ??????????????????.');
      });
  };

  useEffect(() => {
    setItemName(auction.auction_item.item_name);
    setItemCategory(auction.auction_item.item_category);
    setNumberOfItem(auction.auction_item.number_of_item);
    setAppraisalValue(auction.auction_item.appraisal_value);
    setLowestSellingPrice(auction.auction_item.lowest_selling_price);
    setImmadiateSalePrice(auction.auction_item.immediate_sale_price);
    setItemNote(auction.auction_item.item_note);
    setDeadline(auction.auction_item.deadline.substring(0, 10));
  }, [auction.auction_item]);

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>?????? ??????</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">?????? ??????</div>
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
          <div className="col-2 p-2 text-center">?????? ??????</div>
          <div className="col-4 p-2">
            <select
              className="form-control text-center"
              onChange={onItemCategoryHandler}
            >
              <option>??????</option>
              <option selected={item_category === 'building'} value="building">
                ??????
              </option>
              <option selected={item_category === 'clothes'} value="clothes">
                ???
              </option>
            </select>
          </div>
          <div className="col-2 p-2 text-center">?????? ??????</div>
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
          <div className="col-2 p-2 text-center">?????? ?????? ??????</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onAppraisalValueHandler}
              value={appraisal_value}
            />
          </div>
          <div className="col-2 p-2 text-center">?????? ?????? ??????</div>
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
          <div className="col-2 p-2 text-center">?????? ?????? ??????</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onImmadiateSalePriceHandler}
              value={immediate_sale_price}
            />
          </div>
          <div className="col-2 p-2 text-center">?????? ??????</div>
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
          <div className="col-12 p-2 text-center">?????? ??????</div>
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
        {submitMessage !== '' && (
          <div className="alert alert-danger">{submitMessage}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={props.onHide}
        >
          ??????
        </button>
        <button
          type="button"
          className="btn btn-outline-warning"
          onClick={onSubmitHandler}
        >
          ??????
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegistAuctionModal;
