import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

const AuctionRegModal = (props: any) => {
  const [item_name, setItem_name] = useState<string>('');
  const [item_category, setItem_category] = useState<string>('');
  const [number_of_item, setNumber_of_item] = useState<number>(0);
  const [appraisal_value, setAppraisal_value] = useState<number>(0);
  const [lowest_selling_price, setLowest_selling_price] = useState<number>(0);
  const [immediate_sale_price, setImmediate_sale_price] = useState<number>(0);
  const [item_note, setItem_note] = useState<string>('');
  const [reg_datetime, setReg_datetime] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');

  const [submitMessage, setSubmitMessage] = useState<string>('');

  const onItem_nameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setItem_name(e.target.value);
  };
  const onItem_categoryHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setItem_category(e.target.value);
  };
  const onNumber_of_itemHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber_of_item(parseInt(e.target.value));
  };
  const onAppraisal_valueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAppraisal_value(parseInt(e.target.value));
  };
  const onLowest_selling_priceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLowest_selling_price(parseInt(e.target.value));
  };
  const onImmediate_sale_priceHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setImmediate_sale_price(parseInt(e.target.value));
  };
  const onItem_noteHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setItem_note(e.target.value);
  };
  const onReg_datetimeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setReg_datetime(e.target.value);
  };
  const onDeadlineHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const close = () => {
    setItem_name('');
    setItem_category('');
    setNumber_of_item(0);
    setAppraisal_value(0);
    setLowest_selling_price(0);
    setImmediate_sale_price(0);
    setItem_note('');
    setReg_datetime('');
    setDeadline('');
    props.onHide();
  };

  const onSubmitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      item_name.length === 0 ||
      item_category.length === 0 ||
      number_of_item <= 0 ||
      appraisal_value <= 0 ||
      lowest_selling_price <= 0 ||
      item_note.length === 0 ||
      deadline.length === 0
    ) {
      setSubmitMessage(
        '즉시 매입 가격 및 시작일을 제외한 모든 값을 입력하세요.'
      );
      return;
    }

    const body = {
      item_name,
      item_category,
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      item_note,
      reg_datetime,
      deadline,
      saler_id: props.id,
    };

    axios
      .post(`/api/auction/regist`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          close();
        } else {
          setSubmitMessage('경매 등록에 실패했습니다.');
        }
      });
  };

  return <div></div>;
};

export default AuctionRegModal;
