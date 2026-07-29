// we use the model to determine what the data coming from and going to the API will look like

export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear?: number;
  genre: "Fiction" | "Non-Fiction" | "Textbook";
  createdAt?: string;
  updatedAt?: string;
}
