const mongoose = require("mongoose") ;
const {Schema} = mongoose ;



const validCategories = {
    income : ["Stipend", "Allowance", "Freelance", "Other"],
    expense : ["Food", "Travel", "Gym & Diet", "Rent", "Other"]
}


const RecordSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId, ref : "User"
    },
    amount : {
        type : Number,
        required : [true, "Amount is required"],
        min : [1, "Amount cannot be zero or negative"], 

    },
    type : {
        type : String,
        enum : {
          values : ["income", "expense"] ,
          message : '{VALUE} is not a valid type'
        }, 
        required : [true, "Type is required"] ,
    },

    category : {
        type : String ,
        validate : {
            validator : function(value){
                const allowed = validCategories[this.type] ;
                return allowed && allowed.includes(value) ;
            },
            message : function(props) {
                return `${props.value} is not a valid category for a ${this.type} transaction`
            }
        }
    },

    description : {
        type : String,
        trim : true 
    },

    createdAt : {
        type : Date,
        default : Date.now,
    }
});

const FinancialRecord = mongoose.model("FinancialRecord", RecordSchema) ;
module.exports = FinancialRecord ;