import {useSelector} from 'react-redux';
import { useState } from 'react';
import { signOutFailure, signOutSuccess, signOutStart, deleteUserSuccess, deleteUserFailure, deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try{
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          return;
        }

        dispatch(deleteUserSuccess(data));
    } catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;

      }
      dispatch(signOutSuccess(data));
    } catch (error){
        dispatch(signOutFailure(error.message));
    }
  }



  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <img src={currentUser.avatar} alt="Profile" className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2' />

        <input 
          type='text' 
          placeholder='Username' 
          className='border p-3 rounded-lg' 
          id='username' 
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input 
          type='email' 
          placeholder='Email' 
          className='border p-3 rounded-lg' 
          id='email' 
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input 
          type='password' 
          placeholder='Password' 
          className='border p-3 rounded-lg' 
          id='password'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'>{loading? 'Loading...' : "Update"}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5 text-xl text-center font-semibold'>{error? error: ''}</p>
      <p className='text-green-600 mt-5 text-xl text-center font-semibold'>{updateSuccess ? 'User updated successfully' : '' }</p>
    </div>
  )
}
