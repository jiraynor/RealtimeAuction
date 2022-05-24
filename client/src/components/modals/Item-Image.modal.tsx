import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Carousel } from 'react-bootstrap';

const ImageModal = (props: any) => {
  const auction = useSelector((state: any) => state.auction.auction_item);
  const item_imgs = useSelector((state: any) => state.item_img.item_imgs);

  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: any, e: any) => {
    setIndex(selectedIndex);
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>{auction && auction.item_name} 이미지</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {item_imgs &&
            item_imgs.map((item_img: any) => (
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={'http://localhost:4000/api/img/' + item_img.img}
                />
              </Carousel.Item>
            ))}
        </Carousel>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-danger" onClick={props.onHide}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
