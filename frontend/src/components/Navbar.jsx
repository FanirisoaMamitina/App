import React, { useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import userImage from '../assets/image/user.png'
import { IoIosExit, IoIosNotifications, IoIosNotificationsOutline, IoMdExit } from 'react-icons/io'
import Example from './dropDown'
import {
  ArchiveBoxXMarkIcon,
  BellIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { BiBell, BiBellMinus, BiSolidNotification } from 'react-icons/bi'
import { BsBellFill, BsFillBellFill } from 'react-icons/bs'
import { FiBell } from 'react-icons/fi'
import { RiBellFill, RiBellLine, RiNotification2Fill, RiNotificationFill } from 'react-icons/ri'
import { AiFillNotification, AiOutlineNotification } from 'react-icons/ai'


function Navbar() {
  const navigate =useNavigate()
  const { pathname } = useLocation()
  const { user, setUser } = useStateContext()
  const [isOpenDrop, setIsOpenDrop] = useState(false)

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data)
      })
  }, [])

  const handleOpen = () => {
    return setIsOpenDrop(!isOpenDrop);
  }

  // const main = document.getElementById('root');
  // const clik = (e) => {
  //   addEventListener
  // }

  const handlelogout = () => {
     localStorage.clear();
     navigate('/login');
  }

  const handle = () => {
    if (isOpenDrop) {
      return setIsOpenDrop(false)
    } else {
      return null
    }
  }
  return (
    <header onClick={handle} className="header relative">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 col-md-5 col-6">
            <div className="header-left d-flex align-items-center">
              {user.name}
            </div>
          </div>
          <div className="col-lg-7 col-md-7 col-6">
            <div className="header-right">

              {/* <div>
                <Menu>
                  <MenuButton className='relative'>
                    <BiBell size={23} className='text-[#DEE1E2]' />
                    <span className='absolute' ></span>
                  </MenuButton>
                  
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 h-52 scrollbar-none scrollbar-track-dark-second scrollbar-thumb-gray-line hover:scrollbar-thin origin-top-right z-[10000] rounded-xl border border-white/5 bg-dark-second p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <PencilIcon className="size-4 fill-white/30" />
                        Edit
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <Square2StackIcon className="size-4 fill-white/30" />
                        Duplicate
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                      </button>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                        Archive
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <TrashIcon className="size-4 fill-white/30" />
                        Delete
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                      </button>
                    </MenuItem>

                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <Square2StackIcon className="size-4 fill-white/30" />
                        Duplicate
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                      </button>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                        Archive
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <TrashIcon className="size-4 fill-white/30" />
                        Delete
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div> */}

              <div className="profile-box ml-15">
                <button onClick={handleOpen} className="bg-transparent border-0" type="button">
                  <div className="profile-info text-white">
                    <div className="info">
                      <div className="image">
                        <img src={userImage} alt="" />
                      </div>
                      <div className='mt-4'>
                        <h6 className="fw-500">{user.name}</h6>
                        <p className='text-textG'>Admin</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      {isOpenDrop &&
        <ul className="absolute top-17 right-2 bg-dark-second px-8 py-2 rounded-b-md rounded-r-md shadow-md shadow-black text-slate-50">
          <li><button onClick={handlelogout} className='flex items-center space-x-2 hover:text-teal-600' ><span>Logout</span> <IoMdExit /></button></li>
        </ul>
      }
    </header>
  )
}

export default Navbar
