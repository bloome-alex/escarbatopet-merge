const mongoose = require('mongoose')
mongoose.connect(process.env.DB_MONGO, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})

console.log('database connected')