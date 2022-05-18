export const SET_AUCTION = 'SET_AUCTION';
export const REMOVE_AUCTION = 'REMOVE_AUCTION';

export const setAuction = (auction: any) => ({
  type: SET_AUCTION,
  value: auction,
});

export const removeAuction = () => ({
  type: SET_AUCTION,
  value: {},
});
