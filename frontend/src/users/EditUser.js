import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
/* eslint-disable */

export default function EditUser() {

    let navigate = useNavigate();

    const {id} = useParams()

    {/* stare - retine informatii care se pot schimba in timp, in functie de ce face utilizatorul sau de alte evenimente */
    }
    {/* am creat o stare deoarece vrem sa retinem CINE */
    }

    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
    });

    // ia valorile dintr-un obiect si pe pun in variabile separate (din DB pt afisare)
    const {name, username, email} = user;


    // functie care se apeleaza cand utilizatorul modifica un input
    const onInputChange = (e) => {
        setUser({
            ...user, // ...user - pastreaza TOATE valorile existente din user
            [e.target.name]: e.target.value
        }); // actualizeaza doar campul modificat
    };

    useEffect(() => {
        loadUser();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/user/${id}`, user);
        navigate("/");
    };

    const loadUser = async () => {
        const result = await axios.get(`http://localhost:8080/user/${id}`);
        setUser(result.data);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit User</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Name"
                                   className="form-label"> {/* htmlFor - cand dai click pe "Name" cursorul va merge automat in campul <input> corespunzator (value={name} */}
                                Name
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your name"
                                name="name"
                                value={name} // stabileste CE text este afisat in campul input
                                onChange={(e) => onInputChange(e)} // onChange={(e) => onInputChange} - actualizeaza starea cu ceea ce a scris utilizatorul *
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
                                onChange={(e) => onInputChange(e)}

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
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>


                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>

                        <Link type="submit" className="btn btn-outline-danger mx-2" to="/">
                            Cancel
                        </Link>

                    </form>
                </div>
            </div>
        </div>
    );
}
