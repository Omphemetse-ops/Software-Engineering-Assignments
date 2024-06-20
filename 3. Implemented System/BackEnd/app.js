const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const User = require("./models/UserDetails");
const Document = require("./models/Documents");

const app = express();
app.use(express.json());

const mogURL = "xxxxxxx";
mongoose.connect(mogURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log(e);
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Sign up endpoint
app.post("/register", async (req, res) => {
    const { userType, firstName, lastName, idNumber, gender, cellPhoneNumber, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return res.send({ data: 'User already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userType,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            idNumber,
            cellPhoneNumber,
            gender,
        });
        res.send({ status: "OK", data: "User Created", userId: newUser._id });
    } catch (error) {
        res.send({ status: "error", data: error });
    }
});

// Document upload endpoint
app.post("/upload", upload.array('files'), async (req, res) => {
    const { userId } = req.body;
    const files = req.files;

    try {
        let document = await Document.findOne({ userId });
        if (!document) {
            document = new Document({ userId });
        }

        files.forEach((file) => {
            const fileType = file.fieldname;
            document[fileType] = { path: file.path, uploadedAt: new Date() };
        });

        await document.save();

        res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Sign Up componenets
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.send({ status: "error", data: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.send({ status: "error", data: "Invalid password" });
    }

    const loginTime = new Date();
    user.loginTimes.push(loginTime);
    await user.save();

    res.send({ status: "OK", data: "Login successful", loginTime: loginTime.toISOString() });
});


app.listen(5001, () => {
    console.log("Server started on port 5001");
});
