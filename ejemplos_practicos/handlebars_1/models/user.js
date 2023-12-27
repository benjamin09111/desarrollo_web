const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    card: {
        type: String,
        default: "",
    },
    myMoney: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});

//cifrar contraseña
userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
};

//retorna verdadero o falso si las contraseñas criptadas coinciden
userSchema.methods.matchPassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
        .then((result) => {
            if(result) return true;
            return false;
        })
        .catch((error) => {
            throw new Error(error);
        });
};

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;