import React from 'react'
import { use } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(()=>{
    // Implement logic to fetch current user data from the server
     const getCurrentUser=async()=>{
        try {
            const {data} = await axios.get(`${serverUrl}/api/user/me`,{withCredentials:true});
            console.log(data);
            dispatch(setUserData(data.user));
        } catch (error) {
            console.error("Failed to fetch current user", error);
        }
        }
        getCurrentUser();
  },[])
}

export default useGetCurrentUser