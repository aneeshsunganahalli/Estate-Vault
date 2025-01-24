import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { useEffect, useState } from 'react';


export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  const isNotDarkMode = useSelector(state => state.darkMode);
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  }, [window.location.search])

  return (
    <header className={`${isNotDarkMode? 'bg-slate-200' : 'bg-[#10161e]'} shadow-md`}>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 py-5'>

        <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className={`${isNotDarkMode? 'text-slate-500': 'text-[#758499]'} logo text-2xl font-extrabold`}>Estate</span>
              <span className={`${isNotDarkMode? 'text-slate-700' : 'text-[#abb8c9]' } logo text-2xl font-extrabold`}>Vault</span>
            </h1>
        </Link>

        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input 
            type="text" 
            placeholder='Search...' 
            className='bg-transparent focus:outline-none w-24 sm:w-96'
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
          
        </form>
        <ul className='flex gap-4'>

          <Link to='/'>
            <li className={`hidden sm:inline hover:underline ${isNotDarkMode? 'text-slate-700' : 'text-[#abb8c9]' } cursor-pointer`}>
              Home
            </li>
          </Link>

          <Link to='/about'>
            <li className={`hidden sm:inline hover:underline ${isNotDarkMode? 'text-slate-700' : 'text-[#abb8c9]' } cursor-pointer`}>
              About
              </li>
          </Link>

          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src= {currentUser.avatar} alt="Profile" />
            ) : (
              <li className='hover:underline text-slate-700 cursor-pointer'>
              Sign in
              </li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  )
}
