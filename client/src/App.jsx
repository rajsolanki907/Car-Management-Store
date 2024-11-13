import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import CarList from './components/CarList';
import AddCar from './components/AddCar';
import UpdateCar from './components/UpdateCar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/update-car/:id" element={<UpdateCar />} />
      </Routes>
    </Router>
  );
}

export default App;