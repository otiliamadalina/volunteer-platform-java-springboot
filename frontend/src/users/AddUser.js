import React, { useState } from "react";
/* eslint-disable */

export default function AddUser() {
    {/* stare - retine informatii care se pot schimba in timp, in functie de ce face utilizatorul sau de alte evenimente */}
    {/* am creat o stare deoarece vrem sa retinem CINE */}
    {/* onChange={(e) => onInputChange} - actualizeaza starea cu ceea ce a scris utilizatorul */}

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const { name, username, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Register</h2>
          <div className="mb-3">
            <label htmlFor="Name" className="form-label">
              Name
            </label>
            <input
              type={"text"}
              className="form-control"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={(e) => onInputChange} 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Username" className="form-label">
              Username
            </label>
            <input
              type={"text"}
              className="form-control"
              placeholder="Enter your Username"
              name="username"
              value={username}
              onChange={(e) => onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="E-mail" className="form-label">
              E-mail
            </label>
            <input
              type={"text"}
              className="form-control"
              placeholder="Enter your E-mail"
              name="email"
              value={email}
              onChange={(e) => onInputChange}
            />
          </div>

          <button type="submit" className="btn btn-outline-primary">
            Submit
          </button>

          <button type="submit" className="btn btn-outline-danger mx-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
