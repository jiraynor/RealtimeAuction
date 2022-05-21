import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import cookies from 'react-cookies';
import { Modal, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setAuctionList } from '../../actions/auction-list.action';

const RegistAuctionModal = (props: any) => {
  const dispatch = useDispatch();

  const [item_name, setItemName] = useState<string>('');
  const [item_category, setItemCategory] = useState<string>('');
  const [number_of_item, setNumberOfItem] = useState<number>(0);
  const [appraisal_value, setAppraisalValue] = useState<number>(0);
  const [lowest_selling_price, setLowestSellingPrice] = useState<number>(0);
  const [immediate_sale_price, setImmadiateSalePrice] = useState<number>(0);
  const [item_note, setItemNote] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [images, setImages] = useState<any>();

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
  const onImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileVal = e.target.files;
    if (fileVal) {
      for (let i = 0; i < fileVal.length - 1; i++) {
        if (fileVal[i].size > 10 * 1024 * 1024) {
          setSubmitMessage('10MB를 초과하는 이미지는 추가하실수 없습니다.');
          return;
        }
      }

      setImages(fileVal);
    }
  };

  const removeImage = (index: number) => {
    const setter = [];
    for (let i = 0; i < images.length; i++) if (index !== i) setter.push(i);
    setImages(setter);
  };

  const close = () => {
    setItemName('');
    setItemCategory('');
    setNumberOfItem(0);
    setAppraisalValue(0);
    setLowestSellingPrice(0);
    setImmadiateSalePrice(0);
    setImmadiateSalePrice(0);
    setItemNote('');
    setDeadline('');
    setImages([]);
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
      setSubmitMessage('즉시 매각 금액을 제외한 모든 값은 필수 값입니다.');
      return;
    }

    if (
      number_of_item < 1 ||
      appraisal_value < 1 ||
      lowest_selling_price < 1 ||
      immediate_sale_price < 0
    ) {
      setSubmitMessage('갯수 및 금액은 1 이상의 값만 지정할 수 있습니다.');
      return;
    }

    if (
      immediate_sale_price > 0 &&
      lowest_selling_price >= immediate_sale_price
    ) {
      setSubmitMessage('즉시 매각 금액은 최저 매각 금액보다 커야 합니다.');
      return;
    }

    if (new Date(deadline) <= new Date()) {
      setSubmitMessage('마감일은 하루 이상이어야 합니다.');
      return;
    }

    const formData = new FormData();

    formData.append('item_name', item_name);
    formData.append('item_category', item_category);
    formData.append('number_of_item', number_of_item + '');
    formData.append('appraisal_value', appraisal_value + '');
    formData.append('lowest_selling_price', lowest_selling_price + '');

    formData.append('immediate_sale_price', immediate_sale_price + '');
    formData.append('item_note', item_note);
    formData.append('deadline', deadline);
    formData.append('pageType', 'all');

    for (let i = 0; i < images.length - 1; i++)
      formData.append('images', images[i]);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .post(`/api/auction/regist`, formData, config)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setAuctionList(response.data));
          close();
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
        <Modal.Title>경매 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">물건 이름</div>
          <div className="col-10 p-2">
            <input
              type="text"
              className="form-control text-center"
              onChange={onItemNameHandler}
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
              <option value="building">건물</option>
              <option value="clothes">옷</option>
            </select>
          </div>
          <div className="col-2 p-2 text-center">물건 수량</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onNumberOfItemHandler}
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
            />
          </div>
          <div className="col-2 p-2 text-center">최저 매각 금액</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onLowestSellingPriceHandler}
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-2 p-2 text-center">즉시 매각 금액</div>
          <div className="col-4 p-2">
            <input
              type="number"
              className="form-control text-center"
              onChange={onImmadiateSalePriceHandler}
            />
          </div>
          <div className="col-2 p-2 text-center">종료 시간</div>
          <div className="col-4 p-2 text-center">
            <input
              type="date"
              className="form-control text-center"
              onChange={onDeadlineHandler}
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
            />
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-12 p-2 text-center">물건 설명</div>
        </div>
        <div className="mb-2 row">
          <div className="col-12 pl-4 pr-4">
            <label className="btn btn-outline-secondary">
              이미지 추가{' '}
              <input
                type="file"
                multiple
                accept="image/jpg,impge/png,image/jpeg,image/gif"
                style={{ display: 'none' }}
                onChange={onImageHandler}
              />
            </label>
          </div>
        </div>
        <div className="mb-2 row pl-3 pr-3"></div>
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
          취소
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={onSubmitHandler}
        >
          등록
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegistAuctionModal;
