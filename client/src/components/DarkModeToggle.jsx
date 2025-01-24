import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/darkMode/darkModeSlice.js';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function DarkModeToggle() {
  
  const isNotDarkMode = useSelector((state) => state.darkMode)
  const dispatch = useDispatch();
  return (
    <>
    <button className={`${isNotDarkMode? 'text-black' : 'text-white'} outline-none`} onClick={() => dispatch(toggleDarkMode())}>
      {
        isNotDarkMode ? <FaMoon /> : <FaSun />
      }
    </button>
    </>
  )
}
