import React from 'react';
import './App.css';
import AuctionBid from './components/views/AuctionBid';
import AuctionItem from './components/views/AuctionItem';
import AuctionList from './components/views/AuctionList';
import Nav from './components/views/Nav';

function App() {
  return (
    <div className="container">
      <Nav />
      <div className="p-1 row">
        <AuctionItem />
        <AuctionBid />
      </div>
      <AuctionList />
    </div>
  );
}

export default App;
