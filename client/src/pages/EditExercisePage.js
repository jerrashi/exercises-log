import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EditExercisePage = ({ exerciseToEdit }) => {
  const [name, setName] = useState(exerciseToEdit.name);
  const [reps, setReps] = useState(exerciseToEdit.reps);
  const [weight, setWeight] = useState(exerciseToEdit.weight);
  const [unit, setUnit] = useState(exerciseToEdit.unit);
  const [date, setDate] = useState(exerciseToEdit.date);

  const navigate = useNavigate();

  const editExercise = async () => {
    const parsedDate = date !== exerciseToEdit.date ? reformatDate(date) : exerciseToEdit.date;

    const editedExercise = {
      name: name,
      reps: parseInt(reps),
      weight: parseInt(weight),
      unit: unit,
      date: parsedDate,
    };

    try {
      const response = await fetch(`/exercises/${exerciseToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedExercise),
      });

      if (response.status === 200) {
        alert('Successfully edited exercise');
        navigate('/');
      } else {
        alert(`Failed to edit exercise, status code = ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while editing the exercise.');
    }
  };

  const reformatDate = (inputDate) => {
    const [year, month, day] = inputDate.split('-');
    const parsedYear = year.slice(-2);
    return `${month}-${day}-${parsedYear}`;
  };

  return (
    <div>
      <h1>Edit Exercise</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="lbs">lbs</option>
        <option value="kgs">kgs</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={editExercise}>Save</button>
    </div>
  );
};

export default EditExercisePage;