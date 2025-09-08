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
import AdminDashboard from "./pages/admin/adminDashboard";
import ManageVolunteers from "./pages/admin/manageVolunteers";
import ManageOrganisations from "./pages/admin/manageOrganisations";
import ManageEvents from "./pages/admin/manageEvents";
import ManageActivity from "./pages/admin/manageActivity";
import ManageFeedbacks from "./pages/admin/manageFeedbacks";
import ProtectedRoute from "./components/protectedRoute";
import VolunteerDashboard from "./pages/volunteer/volunteerDashboard";
import OrganisationDashboard from "./pages/org/organisationDashboard";

function App() {
    return (
        <div className="App"> {/* folosit pentru stiluri globale */}
            <Router>        {/* monitorizeaza url-ul si decide ce componenta sa se afiseze */}

                <Navbar/> {/* navbar ul este vizibil mereu */}

                <Routes>          {/*container pentru toate definitiile de rute */}

                    {/* aici adaug toate butoanele care duc catre alte pagini ABSOLUT TOATE*/}
                    <Route exact path="/" element={<Home/>}/> {/* cand url ul este / se afiseaza componenta Home */}

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/volunteerOrOrg" element={<VolunteerOrOrg/>}/>
                    <Route path="/registerAsVolunteer" element={<RegisterAsVolunteer/>}/>
                    <Route path="/registerAsOrg" element={<RegisterAsOrg/>}/>

                    {/*<Route path="/volunteerDashboard" element={<VolunteerDashboard />} />*/}
                    {/*<Route path="/organisationDashboard" element={<OrganisationDashboard />} />*/}

                    {/*<Route path="/adminDashboard" element={<AdminDashboard/>}/>*/}
                    <Route path="/adminDashboard/manageVolunteers" element={<ManageVolunteers/>}/>
                    <Route path="/adminDashboard/manageOrganisations" element={<ManageOrganisations/>}/>
                    <Route path="/adminDashboard/manageEvents" element={<ManageEvents/>}/>
                    <Route path="/adminDashboard/manageActivity" element={<ManageActivity/>}/>
                    <Route path="/adminDashboard/manageFeedbacks" element={<ManageFeedbacks/>}/>

                    <Route
                        path="/adminDashboard"
                        element={
                            <ProtectedRoute allowedRole="ADMIN">
                                <AdminDashboard/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/volunteerDashboard"
                        element={
                            <ProtectedRoute allowedRole="VOLUNTEER">
                                <VolunteerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/organisationDashboard"
                        element={
                            <ProtectedRoute allowedRole="ORGANISATION">
                                <OrganisationDashboard />
                            </ProtectedRoute>
                        }
                    />


                </Routes>

                <Footer/>
            </Router>
        </div>
    );
}

export default App;
