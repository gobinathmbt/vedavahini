const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
    uid: { type: String, required: true },
    assigned_by: { type: String, required: true, },
    message: { type: String, required: true },
    is_read: { type: Boolean,default: false },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

TaskSchema.pre('save', function (next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});


module.exports = {
    Task: mongoose.model("task", TaskSchema),
};
