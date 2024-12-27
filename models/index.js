const { json } = require('express')
const mongoose=require ('mongoose')


const LeadSchema= new mongoose.Schema
({  
    name: String,
    title:String,
    date:String,
    data: [
        {
          first_name: String,
          last_name: String,
          email: String,
          
        }
      ]

})
const userSchema= new mongoose.Schema({
    username:String,
    password:String
    
  })
module.exports = {

  Leads: mongoose.model('Leads', LeadSchema),
  User: mongoose.model('User', userSchema)
}

// mongoose.model('Blog', blogSchema)