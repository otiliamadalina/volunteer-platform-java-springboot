import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from "./layout/navbar";
import {Home} from "./pages/home/home";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import Footer from "./layout/footer";

function App() {
    return (
        <div className="App"> {/* folosit pentru stiluri globale */}
            <Router>        {/* monitorizeaza url-ul si decide ce componenta sa se afiseze */}

                <Navbar/> {/* navbar ul este vizibil mereu */}

                <Routes>          {/*container pentru toate definitiile de rute */}

                    {/* aici adaug toate butoanele care duc catre alte pagini ABSOLUT TOATE*/}
                    <Route exact path="/" element={<Home/>}/> {/* cand url ul este / se afiseaza componenta Home */}
                    <Route exact path="/adduser"
                           element={<AddUser/>}/> {/* cand url ul este /adduser se afiseaza componenta AddUser */}
                    <Route exact path="/edituser/:id" element={<EditUser/>}/>
                    <Route exact path="/viewuser/:id" element={<ViewUser/>}/>
                </Routes>

                <Footer/>
            </Router>
        </div>
    );
}

export default App;
