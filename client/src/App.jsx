import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import About from './pages/About';
import CustomHeader from './components/CustomHeader';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';



export default function App() {
  return <BrowserRouter>
  <CustomHeader />
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/sign-in" element={<SignIn />} /> 
      <Route path="/sign-up" element={<SignUp />} /> 
      <Route path="/about" element={<About />} /> 
      <Route element={<PrivateRoute />} >
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Route>

    </Routes>
      
    </BrowserRouter>;

}
