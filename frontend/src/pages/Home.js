import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";

export function Home() {
    const [users, setUsers] = useState([]); // cream o lista goala de users

    const {id} = useParams();

    useEffect(() => {
        loadUsers(); // cand pagina se incarca, ruleaza functia loadUsers
    }, []); // [] - ruleaza o singura data

    const loadUsers = async () => {
        const result = await axios.get("http://localhost:8080/users"); // cere lista de utilizatori
        setUsers(result.data) // ceea ce primeste de la server, pune in lista
    };

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:8080/user/${id}`);
        loadUsers();
    };

    return (
        <div className="container">
            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => ( // users - lista de utilizatori | map - pasrcurge lista si pentru fiecare element face  ceva
                        // ((user, - elementul curent, index) - pozitia elementului
                        // se parcurge lista de elemente (useri)
                        <tr>
                            <th scope="row" key={index}>
                                {index + 1}
                            </th>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link
                                    className="btn btn-primary mx-2"
                                    to={`/viewuser/${user.id}`}
                                >
                                    View
                                </Link>

                                <Link className="btn btn-outline-primary mx-2"
                                      to={`/edituser/${user.id}`}

                                >Edit</Link>

                                <button className="btn btn-danger mx-2"

                                        onClick={() => deleteUser(user.id)}
                                >Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
