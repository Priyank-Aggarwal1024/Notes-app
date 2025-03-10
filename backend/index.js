require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_URI, PORT } = process.env
mongoose.connect(MONGO_URI).then(data => {
    console.log("DB Connection Successfully")
}).catch(err => {
    console.log("DB Connection Failed");
})

const User = require("./models/user.model");
const Note = require('./models/note.model');

const express = require("express")
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authentticateToken } = require("./utilities");
app.use(express.json());
app.use(cors({
    origin: "*",
}))

app.get("/", (req, res) => {
    res.json({ data: "hello" });
})

//  Backend Ready

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is Required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is Required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is Required" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({
            error: true,
            message: "User already exist",
        })
    }
    const user = new User({
        fullName,
        email,
        password
    })
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECERET, {
        expiresIn: "36000m",
    })
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful"
    })
})

// Login Account
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is Required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is Required" });
    }
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User not found" });
    }
    if (userInfo.email == email && userInfo.password == password) {
        const user = {
            user: userInfo,
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECERET, {
            expiresIn: "36000m",
        });
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken
        })
    }
    else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials"
        })
    }
})

// Get User
app.get("/get-user", authentticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
        return res.sendStatus(401);
    }
    return res.json({
        error: false,
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "User fetched successfully"
    })
})

// Create Note
app.post("/add-note", authentticateToken, async (req, res) => {
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    if (!title) {
        return res.status(400).json({ error: true, message: "Title is Required" });
    } if (!content) {
        return res.status(400).json({ error: true, message: "Content is Required" });
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// Edit Note
app.put("/edit-note/:noteId", authentticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && !noteId) {
        return res.status(400).json({
            error: true,
            message: "No changes provided"
        })
    }
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// Get All Notes
app.get("/get-all-notes", authentticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes: notes,
            noteCount: notes.length,
            message: "All notes retrieved successfully"
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

})

// Delete Note
app.delete("/delete-note/:noteId", authentticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ userId: user._id, _id: noteId });
        if (!note) {
            return res.statue(404).json({
                error: true,
                message: "Note not found"
            })
        }
        await Note.deleteOne({ userId: user._id, _id: noteId })
        return res.json({
            error: false,
            message: "Note deleted successfuly"
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

})

// Update isPinned
app.put("/update-note-pinned/:noteId", authentticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }
        note.isPinned = isPinned || false;
        await note.save();
        return res.json({
            error: false,
            message: `Note ${isPinned ? "pinned" : "unpinned"} successfully`
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// Search API
app.get("/search-notes", authentticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search query is required"
        })
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {
                    title: {
                        $regex: new RegExp(query, 'i')
                    }
                },
                {
                    content: {
                        $regex: new RegExp(query, 'i')
                    }
                }
            ]
        })
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search queary  retrieved successfully"
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
})
app.listen(PORT, (req, res) => {
    console.log("Server is starting on PORT = ", PORT)
});

module.exports = app;