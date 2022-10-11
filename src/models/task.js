const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true  
    },
    status: {
        type: String,
        default: 'Not Started'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task;