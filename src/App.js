import SearchPage from './components/SearchPage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import ListingPage from './components/ListingPage.js';

function App() {
    const [showList,setShowList] = useState(false);

    const handleClickList = () => {
        setShowList(true);
    };
  return (
    <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/search"
                        element={<SearchPage handleClickList={handleClickList} />}
                    index/>
                    {showList && <Route path="/list" element={<ListingPage handleClickList={handleClickList} />} />}
                </Routes>
            </div>
        </Router>
  );
}

export default App;
