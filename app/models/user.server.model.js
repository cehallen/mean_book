var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// ***************************
// User Model
// ***************************
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        index: true,
        match: /.+\@.+\..+/
    }, 
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        validate: [
            function(password) {
                return password.length >= 6;
            },
            'Password must be 6 characters or more'
        ]
    },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User']
    },
    website: {
        type: String,
        get: function(url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    }
});

UserSchema.methods.authenticate = function(password) {
    return this.password === password;
};

UserSchema.statics.findOneByUsername = function (username, callback) {
    this.findOne({ username: new RegExp(username, 'i') }, callback);    
};

UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

// *******************************
// Post Schema
// *******************************

var PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

// end


mongoose.model('User', UserSchema);
mongoose.model('Post', PostSchema);
