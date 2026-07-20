// mongoose also allows us to define models, which can be thought of as "tables".
// they allow us to have a rigid structure in a document database, which often expects unstructured data
const mongoose = require("mongoose");

// we start by creating a schema, which is a map/layout of what we want the model to store
const bookSchema = new mongoose.Schema(
  {
    // we don't create a primary key here - as mongo automatically assigns a unique ID to each entry
    title: {
      type: String,
      // the required attribute means that the user HAS to provide this to create a new object, or it will fail
      required: true,
      // trim removes any spaces at the end of the input that the user may accidentally add
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      trim: true,
    },
    publishedYear: Number,
    genre: {
      type: String,
      // by using an enum, you can restict what the user can enter to specific strings
      enum: ["Fiction", "Non-Fiction", "Textbook"],
      required: true,
      trim: true,
    },
  },
  {
    // by enabling timestamps in the schema, the database will automatically create 2 additional helpful fields
    // createdAt - when the object was added to the database
    // updatedAt - when the object was last updated or changed
    timestamps: true,
  },
);

// once we've created the schema, we convert it into a model, so that it can be used elsewhere in the app
// think of the schema as what the table looks like, and the model as the actual interface to the table
const Book = mongoose.model("Book", bookSchema);

// export all the methods to make them "public" (accessible in other files)
module.exports = Book;
