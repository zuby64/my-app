import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import CallsDescription from "./screens/CallsDescription";
import CallsScreen from "./screens/CallsScreen";
import SigninScreen from "./screens/SignInScreen";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SigninScreen />}></Route>
        <Route path="/call/:id" element={<CallsDescription />}></Route>
        <Route path="/" element={<CallsScreen />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
