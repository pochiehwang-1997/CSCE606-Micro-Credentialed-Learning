const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const credentialSchema = new mongoose.Schema({
  name: String,
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  instructor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const groupSchema = new mongoose.Schema({
  name: String,
  credentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Credential"
  }],
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  credentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Credential"
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  }],
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  enroll: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"   // student enroll courses
  }],
  teach: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"  // teacher teaching courses
  }]
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) { // cb = callback
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};


// module.exports.Group = mongoose.model("Group",groupSchema) must be before userSchema.plugin(passportLocalMongoose);
module.exports.Group = mongoose.model("Group", groupSchema);
module.exports.Credential = mongoose.model("Credential", credentialSchema);
module.exports.User = mongoose.model("User", userSchema);
