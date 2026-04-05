const mongoose = require("mongoose") ;
const {Schema} = mongoose ;

const UserSchema = new Schema({
    role : {
        type : String,
        enum : ["Viewer", "Analyst", "Admin"],
        default : "Viewer",
        required :[true, "Role is required"],  
    },

    status : {
        type : String,
        enum :["Active", "Inactive"] ,
        default : "Active",
    },

    userName : {
        type : String,
        minLength : [3, "userName must be at least 3 characters"],
        MaxLength : [20, "userName cannot exceed 20 characters"], 
        required : [true, "Name is required"] ,
        trim : true ,
    },

    password : {
        type : String,
        minLen : [6, "Password length must be at least 6"] ,
        required : [true, "Password is required"],
        select : false ,
    },

    mobileNumber : {
        type : String ,
        required : [true, "Phone number is required"] ,
        unique : true ,
        match : [/^\d{10}$/, "Please enter 10 digit valid mobile number"] ,
    }
}, {
    timestamps : true ,
})

UserSchema.pre("save", async function(next) {
    
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model("User", UserSchema) ;

module.exports = User ;

