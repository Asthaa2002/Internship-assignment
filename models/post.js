const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    postName: {
        type: String,
    },
    postBy: {
        type: String,
    },
    media: {
        name: {type: String},
        path: {type: String},
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    comments: [
        {
            commentedBy: {
                type: String,
            },
            commentedData: {
                type: String,
            },
            reply: [
                {
                    repliedBy: {
                        type:String,
                    },
                    repliedData: {
                        type: String,
                    }
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Post_Data',postSchema)