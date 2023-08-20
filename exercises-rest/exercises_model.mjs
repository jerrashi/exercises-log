import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to Azure Cosmos DB');
});


/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true},
    weight: { type: Number, required: true},
    unit: { type: String, required: true},
    date: { type: String, required: true},
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
 * Create a exercise
 * @param {String} name
 * @param {Number} reps
 * @param {Number} weight
 * @param {String} unit
 * @param {String} date
 * @returns A promise. Resolves to the JSON object for the document created by calling save
 */
const createExercise = async (name, reps, weight, unit, date) => {
    // Call the constructor to create an instance of the model class Exercise
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    // Call save to save the document to the database
    return exercise.save();
}

/**
 * Retrieve exercises based on the filter, projection and limit parameters
 * @param {Object} filter
 * @param {Object} projection
 * @param {Number} limit
 * @returns
 */
const findExercises = async (filter, projection, limit) => {
    const query = Exercise.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
}

/**
 * Retrieve a exercise by its id
 * @param {String} _id
 * @returns
 */
const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

/**
 * Replace the name, reps, weight, unit and date of the exercise with the id provided
 * @param {String} _id
 * @param {String} name
 * @param {Number} reps
 * @param {Number} weight
 * @param {String} unit
 * @param {String} date
 * @returns a promise. Resolves to the number of documents updated.
 */
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    const result = await Exercise.replaceOne({ _id: objectId }, { name: name, reps: reps, weight: weight, unit: unit, date: date });
    return result.modifiedCount;
}

/**
 * Delete the exercise with the id provided
 * @param {String} _id
 * @returns a promise. Resolves to the number of documents deleted.
 */
const deleteById = async (_id) => {
    const objectId = new mongoose.Types.ObjectId(_id);
    const result = await Exercise.deleteOne({ _id: objectId });
    return result.deletedCount;
}

export{ createExercise, findExercises, findExerciseById, replaceExercise, deleteById}