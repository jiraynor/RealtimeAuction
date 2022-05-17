import './App.css';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import AuctionBid from './components/views/AuctionBid';
import AuctionItem from './components/views/AuctionItem';
import AuctionList from './components/views/AuctionList';
import Nav from './components/views/Nav';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <Nav />
        <div className="p-1 row">
          <AuctionItem />
          <AuctionBid />
        </div>
        <AuctionList />
      </div>
    </Provider>
  );
}
