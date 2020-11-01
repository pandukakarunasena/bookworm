//data model for author
const mongoose = require('mongoose')

//plot and rules for author
//json object with name and its must
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    }
})

//model is the class which is declared by the Schema 
//instances/objects can be made out it 
module.exports = mongoose.model('Author', authorSchema)