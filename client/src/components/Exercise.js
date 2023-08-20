import React from 'react';
import {MdDeleteForever, MdEdit} from 'react-icons/md';

function Exercise({exercise, onDelete, onEdit}){
    return (
        <tr>
            <td>{exercise.name}</td>
            <td>{exercise.reps}</td>
            <td>{exercise.weight}</td>
            <td>{exercise.unit}</td>
            <td>{exercise.date}</td>
            <td><button><MdEdit onClick={() => onEdit(exercise)}/></button></td>
            <td><button><MdDeleteForever onClick={() => onDelete(exercise._id)}/></button></td>
        </tr>
    );
}

export default Exercise;