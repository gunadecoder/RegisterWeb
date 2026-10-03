import {useState} from "react";


function App(){

  const [name, setName] =useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if(name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if(email.trim() === ""){
      newErrors.email = "Email is required";
    } else if (!email.includes("@")){
      newErrors.email = "Enter a valid email";
    }

    if(gender === "") {
      newErrors.gender = "Please select gender";
    }

    if(phone.trim() === "") {
      newErrors.phone = "Phone is required"
    } else if(! /^\d{10}$/.test(phone)){
      newErrors.phone = "Phone must contain 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if(!isValid) {
      return;
    }

    const user = {
      name:name,
      email:email,
      gender:gender,
      phone:phone
    };

    try {
      const response = await fetch(
        "https://localhost:7154/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      if(response.ok)
      {
        setMessage("Registration successful.");

        setName("");
        setEmail("");
        setGender("");
        setPhone("");
      }
      else if (response.status ===409){
        setMessage("Email ID already exists.");
      }
      else{
        setMessage("Registration failed.");
      }
    } 
    catch(error)
    {
      console.error(error);
      setMessage("Unable to connect to the API.")
    }
  };
  
  // console.log("Name:", name);
  // console.log("Email:", email);
  // console.log("Gender:", gender);
  // console.log("Phone:", phone);

  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit= {handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Name:</label>
          <br />
          <input id="name" type="text" value={name}
          onChange={(event) => setName(event.target.value)}
          />

          {errors.name && (<p>{errors.name}</p>)}

        </div>
        <br/>
        <div>
          <label htmlFor="email">Email ID:</label> <br />
          <input id="email" type="email" value={email}
          onChange={(event) => setEmail(event.target.value)}
          />

          {errors.email && (<p>{errors.email}</p>)}
        </div>
        <br />

        <div>
          <label>Gender:</label><br />
          <label>
            <input type="radio" name="gender" value="Male"
            checked = {gender === "Male"}
            onChange={(event) => setGender(event.target.value)}
            />
            Male
          </label>
          <br />
          <label>
            <input type="radio" name="gender" value="Female"
            checked = {gender==="Female"}
            onChange={(event) => {setGender(event.target.value)}}
            />
            Female
          </label>

          {errors.gender && (<p>{errors.gender}</p>)}

        </div>
        <br />
        <div>
          <label htmlFor="phone">Phone:</label><br/>
          <input id="phone" type="tel" value={phone}
          onChange={(event) => setPhone(event.target.value)}
          />

          {errors.phone && (<p>{errors.phone}</p>)}
        </div>

        <br />
        <button type="submit">Register</button>
      </form>
      {
        message && (<p>{message}</p>)
      }
    </div>
  );


}

export default App;