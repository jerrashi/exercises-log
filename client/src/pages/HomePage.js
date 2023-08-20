import Exercise from '../components/Exercise.js';
import ExerciseList from '../components/ExerciseList.js';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function HomePage({setExerciseToEdit}){

    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'DELETE'});
        if(response.status === 204){ //delete successful
            const newExercises = exercises.filter((exercise) => exercise._id !== _id);
            setExercises(newExercises);
        } else{
            console.error(`Failed to delete exercise with id ${_id}, status code = ${response.status}`);
        }
    }

    const onEdit = exercise => {
        setExerciseToEdit(exercise);
        navigate(`/edit-exercise`)
    }

    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const data = await response.json();
        setExercises(data);
    }

    useEffect(() => {
        loadExercises(); //useEffect can not be passed an async function so we use a named function
    }, []);


    return (
        <>
            <h2> List of Exercises</h2>
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit} />
            <Link to="/add-exercise">Add Exercise</Link>
        </>
    )
}

export default HomePage;