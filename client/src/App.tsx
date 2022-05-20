import './App.css';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import AuctionList from './components/views/AuctionList';
import Nav from './components/views/Nav';
import Auction from './components/views/Auction';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <Nav />
        <Auction />
        <AuctionList />
      </div>
    </Provider>
  );
}
