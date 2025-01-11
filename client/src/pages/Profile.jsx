import {useSelector} from 'react-redux';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { signOutFailure, signOutSuccess, signOutStart, deleteUserSuccess, deleteUserFailure, deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';


export default function Profile() {
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({...formData, avatar: downloadURL}));
      }
    )
  }

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

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)

      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true)
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if(data.success === false) {
        console.log(data.message)
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="Profile" 
          className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2' 
        />
        <p className='self-center text-sm'>
          {fileUploadError ? (<span className='text-red-700'>Error Image Upload (Image must be less than 2MB)</span>) 
          : 
          filePerc > 0 && filePerc < 100 ? 
            (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)  
            :
            filePerc === 100 ? 
              (<span className='text-green-700'>Image Successfully Uploaded</span>)
              : (
              ''
          )
        }
        </p>

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
        <Link className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-90 text-center' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-red-700 mt-5 text-xl text-center font-semibold'>{error? error: ''}</p>

      <p className='text-green-600 mt-5 text-xl text-center font-semibold'>{updateSuccess ? 'User updated successfully' : '' }</p>

      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>

      <p className='text-red-700 mt-5'>{showListingsError? 'Error showing listings' : ''}</p>

      {userListings && userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-3xl font-semibold'>Your Listings</h1>

        {userListings.map((listing) => (
          <div key={listing._id} className='border p-3 rounded-lg flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className='h-28 w-28 object-contain'/>
            </Link>
            <Link className='text-slate-700 flex-1 font-semibold hover:underline truncate' to={`/listings/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`} >
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
        ))}

      </div>
      }

    </div>
  )
}
