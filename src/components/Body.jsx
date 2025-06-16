import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';


import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();   const  userData =  useSelector((store) => store.user);



  const fetchUser = async () => {

    if(userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if(error.status == 401){
        navigate("/login"); 
      }
      
      console.log(error);  // also fixed the typo here: `loh` -> `log`
    }
  };

  useEffect(() => {
   
    fetchUser();
    
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
