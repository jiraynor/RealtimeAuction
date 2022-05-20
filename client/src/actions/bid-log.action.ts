export const SET_BID_LOG = 'SET_BID_LOG';
export const REMOVE_BID_LOG = 'REMOVE_BID_LOG';

export const setBidLog = (auction: any) => ({
  type: SET_BID_LOG,
  value: auction,
});

export const removeBidLog = () => ({
  type: REMOVE_BID_LOG,
  value: { auction_item: undefined },
});
