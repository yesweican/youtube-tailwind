import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faHome, faFeed, faFilm,faPenToSquare, faVideo, faTv, faTvAlt, faCog ,faCircleUser, faUsers, faSearch} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API_END_POINT } from '../config/constants.js';

// Import your content components
import Home from './Home';
import Component1 from './Component1';
import Component2 from './Component2';
import NewArticle from './NewArticle';
import NewVideo from './NewVideo';
import NewChannel from './NewChannel';
import ManageChannel from './Error404';
import NewComment from './NewComment';
import Groups from './Groups';
import Profile from './Profile';
import Settings from './Settings';
import RegistrationPage from './RegistrationPage';
import Error404 from './Error404.js';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogInDialog, setShowLogInDialog] = useState(false);
  const [loginUser, setLoginUser] = useState({
    username: '',
    password: ''});
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const clickLogIn = () => {
    setShowLogInDialog(true);
    //setIsLoggedIn(true);    
  };

  const clickLogOut = () => {
    setIsLoggedIn(false);
  };

  const clickRegister = () => {
    navigate('/register');
  };  

  const handleLogInChange = (e) => {
    setLoginUser((prevUser) =>({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const handleLogInClose = () => setShowLogInDialog(false);
  const handleLogInSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    // Handle login logic here
    try {
      const response = await axios.post(AUTH_API_END_POINT+'/login', loginUser);

      //Only after successful  authentication
      setIsLoggedIn(true);

      // Extract tokens from the response
      const { user, accessToken, refreshToken } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('currentUser', user);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log(`Login successful! Welcome, ${response.data.user.username}`);
    } catch (error) {
      console.log(`Login failed: ${error.response?.data?.message || error.message}`);
    } 
    console.log("Username:", loginUser.username, "Password:", loginUser.password);
    setShowLogInDialog(false);

  };

  return (
    <div className="flex flex-col h-screen">

      {/* Cross-Section Header */}
      <header className="w-full bg-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold">App Header</h1>
          {/* Search Bar */}
          <div className="flex items-center space-x-1">
            {/* Search Icon */}
            <div className="flex items-center bg-white rounded-l-md px-2 h-10">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </div>
            {/* Input Box */}
            <input
              type="text"
              placeholder="Search..."
              className="p-2 w-64 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 rounded-r-md h-10"
            />
            {/* Button */}
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Search
            </button>
          </div>
          <div className="space-x-4">
            {isLoggedIn === false && <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={clickLogIn}>LogIn</button>}  
            {isLoggedIn === false && <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={clickRegister}>CreateAccount</button>} 
            {isLoggedIn === true && <button className="px-4 py-2 bg-blue-500 rounded-md">Profile</button>}  
            {isLoggedIn === true && <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={clickLogOut}>LogOut</button>}          
          </div>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex flex-grow pt-16"> {/* Add pt-16 to offset header height */}
        {/* Sidebar */}
        <div
          className={`flex flex-col bg-gray-800 text-white transition-width duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Header with Toggle Button */}
          <div className="flex items-center justify-between p-4">
            <h1 className={`${isCollapsed ? 'hidden' : 'block'} text-lg font-bold`}>
              Sidebar
            </h1>
            <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <div className="flex flex-col p-4 space-y-2">
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/Home" className="text-left p-2 hover:bg-gray-700 rounded-md">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Home
              </Link>
            </button>          
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/component1" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faFeed} className="mr-2" />
                Menu 1
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/component2" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faFilm} className="mr-2" />
                Menu 2
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/newarticle" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                New Article
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/newvideo" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faVideo} className="mr-2" />
                New Video
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/newchannel" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faTv} className="mr-2" />
                New Channel
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/managechannel" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faTvAlt} className="mr-2" />
                Manage Channel
              </Link>
            </button>            
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/groups" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Groups
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/profile" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
                Profile
              </Link>
            </button>
            <button
              className="text-left p-2 hover:bg-gray-700 rounded-md"
            >
              <Link to="/settings" className="text-left p-2 hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
                Settings
              </Link>
            </button>
          </div>

          </div>

          {/* Main Content Area */}
          <div
            className={`flex-grow p-3 bg-gray-100 transition-margin duration-300 ${
              isCollapsed ? 'ml-5' : 'ml-10'
            }`}
          >
              <Routes>
                {/* Default route that redirects to /component1 */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/component1" element={<Component1 />} />
                <Route path="/component2" element={<Component2 />} />
                <Route path="/newarticle" element={<NewArticle />} />
                <Route path="/newvideo" element={<NewVideo />} />  
                <Route path="/newchannel" element={<NewChannel />} />
                <Route path="/managechannel" element={<ManageChannel />} /> 
                <Route path="/newcomment" element={<NewComment />} />                              
                <Route path="/groups" element={<Groups />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
          
          </div>
          <div className="relative">
          {showLogInDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
              <form onSubmit={handleLogInSubmit}>
              <h2 className="text-lg font-semibold">Login</h2>
                <div className="my-4">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Email(or Username)"
                    value={loginUser.username}
                    onChange={handleLogInChange}
                    className="w-full p-2 border rounded-md mb-4"
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={loginUser.password}
                    onChange={handleLogInChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={handleLogInClose}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}
          </div>

      </div>
    </div>
  );
}

export default Layout;

