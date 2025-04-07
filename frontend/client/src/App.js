import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Status from "./Components/Status/Status";
import StatusViewer from "./Components/Status/StatusViewer";
import SignIn from "./Components/Register/SignIn";
import SignUp from "./Components/Register/SignUp";
// Interesting error above

// Route - path and element
function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/status" element={<Status/>}></Route>
          <Route path="/statusViewer" element={<StatusViewer/>}></Route>
          <Route path="/signin" element={<SignIn/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
        </Routes>
    </div>
  );
}

export default App;