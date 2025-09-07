import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from "./layout/navbar";
import {Home} from "./pages/home/home";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Footer from "./layout/footer";
import VolunteerOrOrg from "./pages/auth/volunteerOrOrg";
import RegisterAsVolunteer from "./pages/auth/registerAsVolunteer";
import RegisterAsOrg from "./pages/auth/registerAsOrg";
import Login from "./pages/auth/login";
import AdminDashboard from "./admin/adminDashboard";

function App() {
    return (
        <div className="App"> {/* folosit pentru stiluri globale */}
            <Router>        {/* monitorizeaza url-ul si decide ce componenta sa se afiseze */}

                <Navbar/> {/* navbar ul este vizibil mereu */}

                <Routes>          {/*container pentru toate definitiile de rute */}

                    {/* aici adaug toate butoanele care duc catre alte pagini ABSOLUT TOATE*/}
                    <Route exact path="/" element={<Home/>}/> {/* cand url ul este / se afiseaza componenta Home */}

                    <Route path="/login" element={<Login />} />
                    <Route path="/volunteerOrOrg" element={<VolunteerOrOrg />} />
                    <Route path="/registerAsVolunteer" element={<RegisterAsVolunteer />} />
                    <Route path="/registerAsOrg" element={<RegisterAsOrg />} />

                    <Route path="/adminDashboard" element={<AdminDashboard />} />


                </Routes>

                <Footer/>
            </Router>
        </div>
    );
}

export default App;
