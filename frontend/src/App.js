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
import AdminLayout from "./pages/admin/adminLayout";
import ManageVolunteers from "./pages/admin/manageVolunteers";
import ManageOrganisations from "./pages/admin/manageOrganisations";
import ManageEvents from "./pages/admin/manageEvents";
import ManageActivity from "./pages/admin/manageActivity";
import ManageFeedbacks from "./pages/admin/manageFeedbacks";
import ProtectedRoute from "./components/protectedRoute";
import VolunteerDashboard from "./pages/volunteer/volunteerDashboard";
import VolunteerLayout from "./pages/volunteer/volunteerLayout";
import ParticipationHistory from "./pages/volunteer/participationHistory";
import EditProfile from "./pages/volunteer/editProfile";
import CalendarScheduler from "./pages/volunteer/calendarScheduler";
import OrganisationDashboard from "./pages/org/organisationDashboard";
import OrgLayout from "./pages/org/orgLayout";
import CreateEvent from "./pages/org/createEvent";
import OrgManageEvents from "./pages/org/manageEvents";
import Reports from "./pages/org/reports";
import NotifyVolunteers from "./pages/org/notifyVolunteers";

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

                    <Route
                        path="/adminDashboard"
                        element={
                            <ProtectedRoute allowedRole="ADMIN">
                                <AdminLayout/>
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="manageVolunteers" element={<ManageVolunteers/>} />
                        <Route path="manageOrganisations" element={<ManageOrganisations/>} />
                        <Route path="manageEvents" element={<ManageEvents/>} />
                        <Route path="manageActivity" element={<ManageActivity/>} />
                        <Route path="manageFeedbacks" element={<ManageFeedbacks/>} />
                    </Route>

                    <Route
                        path="/volunteerDashboard"
                        element={
                            <ProtectedRoute allowedRole="VOLUNTEER">
                                <VolunteerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<VolunteerDashboard />} />
                        <Route path="participationHistory" element={<ParticipationHistory />} />
                        <Route path="editProfile" element={<EditProfile />} />
                        <Route path="calendarScheduler" element={<CalendarScheduler />} />
                    </Route>

                    <Route
                        path="/organisationDashboard"
                        element={
                            <ProtectedRoute allowedRole="ORGANISATION">
                                <OrgLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<OrganisationDashboard />} />
                        <Route path="createEvent" element={<CreateEvent />} />
                        <Route path="manageEvents" element={<OrgManageEvents />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="notifyVolunteers" element={<NotifyVolunteers />} />
                    </Route>


                </Routes>

                <Footer/>
            </Router>
        </div>
    );
}

export default App;
