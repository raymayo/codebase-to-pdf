import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
        default: 1000, // Start registration number from 1000
    },
});

const Counter = mongoose.model('Counter', CounterSchema);

export default Counter;
