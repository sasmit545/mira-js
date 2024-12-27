const express =require('express')
const app= express()
const connectDB=require('./db/ConnectDB.js')
const cors=require('cors')
const uploadRoutes = require('./routes/upload.js')
const userRoutes = require('./routes/user.js')
const listsRoutes = require('./routes/getlists.js')
const automationRoutes=require('./routes/startauto.js')
require('dotenv').config()


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/blogs',route)
// app.use('/api/v1/blogs/create',create)
// app.use('/api/v1/blogs/get',getBlog)
// app.use('/api/v1/user',user)

app.use("/api/upload", uploadRoutes);
app.use("/api/user",userRoutes)
app.use("/api/lists",listsRoutes)
app.use("/api/automation",automationRoutes)


const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};



start()

