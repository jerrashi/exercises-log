import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const AddExercisePage = () => {
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('lbs');
    const [date, setDate] = useState('');

    const navigate = useNavigate();

    const addExercise = async () => {
        //reformat date to match the format expected by the server
        const[year, month, day] = date.split('-');
        const parsedYear = year.slice(-2); // Extract the last two digits of the year
        const parsedDate = `${month}-${day}-${parsedYear}`;

        const newExercise = {name, reps, weight, unit, date: parsedDate}
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json'
            }});
        if(response.status === 201){
            alert("Successfully added exercise");
            const data = await response.json();
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        // redirect to the homepage
        navigate(`/`);
    };

    // react forms for user to input exercise data, using a select element for the unit
    return (
        <div>
            <h1>Add Exercise</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}/>
            <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={e => setReps(e.target.value)}/>
            <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={e => setWeight(e.target.value)}/>
            <select
                value={unit}
                onChange={e => setUnit(e.target.value)}>
                <option value="lbs">lbs</option>
                <option value="kgs">kgs</option>
            </select>
            <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={e => setDate(e.target.value)}/>
            <button onClick={addExercise}>Add Exercise</button>
        </div>
    )
};

export default AddExercisePage;