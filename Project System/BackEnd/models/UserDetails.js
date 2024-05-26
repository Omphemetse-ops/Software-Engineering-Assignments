const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idNumber: { type: String },
    cellPhoneNumber: { type: String, required: true },
    gender: { type: String},
    loginTimes: { type: [Date] }
}, {
    collection: "UserInfor"
});

module.exports = mongoose.model('UserInfor', UserSchema);
