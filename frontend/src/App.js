import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AddUser from "./users/AddUser";

function App() {
    return (
        <div className="App"> {/* folosit pentru stiluri globale */}
            <Router>        {/* monitorizeaza url-ul si decide ce componenta sa se afiseze */}

                <Navbar />        {/* navbar ul este vizibil mereu */}

                <Routes>          {/*container pentru toate definitiile de rute */}

                    {/* aici adaug toate butoanele care duc catre alte pagini ABSOLUT TOATE*/}
                    <Route exact path="/" element={<Home />} />                   {/* cand url ul este / se afiseaza componenta Home */}
                    <Route exact path="/adduser" element={<AddUser />} />         {/* cand url ul este /adduser se afiseaza componenta AddUser */}

                </Routes>

            </Router>
        </div>
    );
}

export default App;
