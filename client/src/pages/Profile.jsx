import {useSelector} from 'react-redux';

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-5'>
        <img src={currentUser.avatar} alt="Profile" className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2' />
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username'/>
        <input type='text' placeholder='Email' className='border p-3 rounded-lg' id='email'/>
        <input type='text' placeholder='Password' className='border p-3 rounded-lg' id='password'/>

        <button className='bg-slate-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer'>Delete account</span>
        <span className='text-red-600 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
