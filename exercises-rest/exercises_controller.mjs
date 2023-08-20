import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
const path = require('path');

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    console.log(date);
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * Function to validate the request body for the POST and PUT requests
 * @param {Object} body
 * @returns true if the body is valid, false otherwise
 */
function isBodyValid(body) {
    const { name, reps, weight, unit, date } = body;

    const parsedReps = parseInt(reps);
    const parsedWeight = parseInt(weight);

    // Check if all the required properties are present and have valid values
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        console.log("invalid name")
        return false;
    }

    if (!parsedReps || typeof parsedReps !== 'number' || parsedReps <= 0) {
        console.log("invalid reps")
        return false;
    }

    if (!parsedWeight || typeof parsedWeight !== 'number' || parsedWeight <= 0) {
        console.log("invalid weight")
        return false;
    }

    if (!unit || typeof unit !== 'string' || (unit !== 'lbs' && unit !== 'kgs')) {
        console.log("invalid unit")
        return false;
    }

    if (!date || typeof date !== 'string') {
        console.log(date)
        console.log(typeof date)
        console.log("invalid date")
        return false;
    } else if (!isDateValid(date)) {
        console.log(date)
        console.log("invalid date format")
        return false;
    }

    return true;
}



/**
 * Create a new exercise with the name, weight and date provided in the body
 * Validate request body using the following requirements
 * - body must contain all 5 properties
 * - name must be a string containing at least one character (can't be empty or null string)
 * - reps must be an integer greater than 0
 * - weight must be an integer greater than 0
 * - unit must be either "lbs" or "kgs" string
 * - date must be a string in the format MM-DD-YY
 */
app.post('/exercises', (req, res) => {
    if (!isBodyValid(req.body)) {
        return res.status(400).json({ Error: 'Invalid request' });
    }
    
    const{ name, reps, weight, unit, date } = req.body;

    exercises.createExercise(name, reps, weight, unit, date)
        .then((exercise) => {
            res.status(201).json(exercise);
        })
        .catch((error) => {
            console.log("ERROR - createExercise()")
            console.error(error);
            res.status(400).json({ Error: 'Invalid request' });      
        });
});

/**
 * Retrieve exercises. 
 * If the query parameters include a weight, then only the exercises for that weight are returned.
 * Otherwise, all exercises are returned.
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    // Is there a query parameter called weight? If so, add it to the filter
    if (req.query.weight !== undefined) {
        filter.weight = parseInt(req.query.weight);
    }
    exercises.findExercises(filter, '', 0)
        .then((exercises) => {
            res.status(200).json(exercises);
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send({ Error: 'Request failed' });
        });
});

/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then((exercise) => {
            if (exercise !== null) {
                res.status(200).json(exercise); // will also return status code 200 if not explicitly specified
            } else {
                res.status(404).send({ Error: `Exercise with id ${exerciseId} not found` });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send({ Error: 'Request failed' });
        });
});

/**
 * Update the exercise whose id is provided in the path parameter and update
 * its properties based on the values provided in the body.
 */
app.put('/exercises/:_id', async (req, res) => {
    const exerciseId = req.params._id;
    const { name, reps, weight, unit, date } = req.body;

    try {
        const numUpdated = await exercises.replaceExercise(exerciseId, name, reps, weight, unit, date);
        
        if (numUpdated === 1) {
            const updatedExercise = await exercises.findExerciseById(exerciseId);
            res.status(200).json(updatedExercise);
        } else {
            console.log("ERROR - numUpdated != 1");
            console.log(`Exercise id: ${exerciseId}`);
            res.status(404).send({ Error: "Not found" });
        }
    } catch (error) {
        console.log("ERROR - replaceExercise()");
        console.log(`Exercise id: ${exerciseId}`);
        console.error(error);
        res.status(404).send({ Error: "Not found" });
    }
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.deleteById(exerciseId)
        .then((numDeleted) => {
            if (numDeleted == 1){
                res.status(204).send();
            } else {
                console.log("ERROR - numDeleted != 1")
                console.log(`Exercise id: ${exerciseId}`)
                res.status(404).send({ Error: "Not found" });
            }
        })
        .catch((error) => {
            console.log("ERROR - deletebyId()")
            console.log(`Exercise id: ${exerciseId}`)
            console.error(error);
            res.status(404).send({ Error: "Not Found" });
        });
});

//Production script
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});