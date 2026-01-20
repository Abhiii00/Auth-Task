import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "./coreFIles/config";
import Login from "./component/login";
import UserList from "./component/UserList";
import Forbidden from "./component/Forbidden";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={config.baseUrl} element={<Login />} />

        <Route
          path={`${config.baseUrl}user-list`}
          element={<UserList />}
        />

        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
