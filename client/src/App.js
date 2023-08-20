import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditExercisePage from './pages/EditExercisePage';
import AddExercisePage from './pages/AddExercisePage';
import { useState } from 'react';


function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();
  return (
    <div className="App">
      <Router>
        <div className="App-header">
          <Routes>
            <Route path="/" exact element={<HomePage setExerciseToEdit={setExerciseToEdit}/>}/>
            <Route path="/add-exercise" element={<AddExercisePage/>}/>
            <Route path="/edit-exercise" element={<EditExercisePage exerciseToEdit={exerciseToEdit}/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
