const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    userId : {
       type: Schema.Types.ObjectId,
       required: true,
       ref: 'User' 
    }
})

module.exports = mongoose.model('Post', postSchema);