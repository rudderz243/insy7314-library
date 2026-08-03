// mongoose = allows us to interact with a mongo db
const mongoose = require("mongoose");
// bcrypt - it handles crpytography operations in our codebase (hashing)
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patron", "librarian"],
    default: "patron",
  },
});

// hook function -> is something that runs when something else is called
// when we save the user -> a hook function will run to do something before the user is saved
userSchema.pre("save", async function (next) {
  // if the user is not modifying their password, we can skip this step
  if (!this.isModified("password")) {
    return next();
  }
  // otherwise, if it is a new user, or the user is updating their password, we must hash/salt the password
  try {
    // 1st => season the password with some salt
    const salt = await bcrypt.genSalt(10);
    // 2 => we combine the salt with the users password
    this.password = await bcrypt.hash(this.password, salt);
    // 3 => once the password is appropriately seasoned, we move to the next step, which is saving
    next();
  } catch (error) {
    next(error);
  }
});

// write a helper function to compare the user input when logging in (which is plain text), with the seasoned password
// in our database
userSchema.methods.matchPassword = async function (enteredPassword) {
  /// uses the compare method to compare (wow)
  return await bcrypt.compare(enteredPassword, this.password);
};

// export the model so that it can be used elsewhere :)
module.exports = mongoose.model("User", userSchema);
