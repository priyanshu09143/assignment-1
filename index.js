import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
const app = express();
const port = process.env.PORT || 3000;
import dotenv from "dotenv"


dotenv.config(
  {
    path: './config.env',
  }
)
// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI,{dbName: "FormDatabases"})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

  // This function convert the User data into a table structure
  app.use(urlencoded({ extended: true }))
  // firstName=Priyanshu&lastName=saini&mobileNo=2340812378&emailId=

  app.use(express.static("public"))
// Define the schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: Number,
  emailId: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
  },
  loginId: String,
  password: String,
  creationTime: Date,
  lastUpdatedOn: Date,
});

// Create the model
const User = mongoose.model('User', userSchema);


app.get("/", (req, res) => {
  res.render('index.ejs');
}); 

app.get('/Users',(req,res)=>{
  res.render('User.ejs')
})
// Create a new user
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  user.creationTime = new Date();
  user.lastUpdatedOn = new Date();
  await user.save();
  res.send(user);
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});
// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));