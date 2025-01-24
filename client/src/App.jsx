import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';


export default function App() {
  const isNotDarkMode = useSelector(state => state.darkMode)
  console.log(isNotDarkMode)

  return (
    <div className={`${isNotDarkMode? 'bg-[#f1f5f1]' : "bg-[#0b0f0b]" } min-h-screen`}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route path='/search' element={<Search />} />

          <Route element={<PrivateRoute />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          </Route>          
    
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
