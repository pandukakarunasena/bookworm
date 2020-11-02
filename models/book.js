const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    publishDate:{
        type: Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    },

    //images are saved in the server as names(Strings)
    coverImageName:{
        type:String,
        required:true
    },

    //we need to take the authors from the authors collection
    //so we type and ref like below
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Author'
    }

})

//virtual can add a property to schema which 
//is derived by the existing values
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath