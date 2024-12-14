import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/image/logo.png'
import { delay, motion } from 'framer-motion'
import { IoIosArrowBack, IoMdMenu ,IoMdCash} from 'react-icons/io'
import { AiOutlineAppstore } from 'react-icons/ai'
import { BiPackage, BiBriefcaseAlt2, BiBell } from 'react-icons/bi';
import { BsPerson } from 'react-icons/bs';
import { FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { AiOutlineFileText, AiOutlineHistory } from 'react-icons/ai';
import { RiSettings4Line } from 'react-icons/ri';
import { TbCashRegister,TbCashBanknote  } from "react-icons/tb";
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import SubMenu from './SubMenu'
import { useMediaQuery } from 'react-responsive'
import { IoAnalyticsOutline, IoCashOutline } from 'react-icons/io5'

function Sidebar() {

  let isTab = useMediaQuery({ query: "(max-width: 768px)" });

  const { pathname } = useLocation()

  const [isOpen, setIsOpen] = useState(isTab ? false : true);

  const Sidebar_animation = isTab ?
    {
      open: {
        x: 0,
        width: "16rem",
        transition: {
          damping: 40,
        },
      },
      closed: {
        x: -250,
        width: 0,
        transition: {
          damping: 40,
          delay: 0.15,
        },
      }
    } : {
      open: {
        width: "16rem",
        transition: {
          damping: 40,
        },
      },
      closed: {
        width: "4rem",
        transition: {
          damping: 40,
        },
      }
    }


  useEffect(() => {
    if (isTab) {
      setIsOpen(false);
    } else {
      setIsOpen(true)
    }
  }, [isTab])

  useEffect(() => {
    isTab && setIsOpen(false);
  }, [pathname])

  const subMenusList = [
    {
      name: "Produits",
      icon: BiPackage,
      menus: ["Liste Produits", "Ajout Produits", "Categories", "Ajout Categories"]
    },
    {
      name: "Clients",
      icon: BsPerson,
      menus: ["Liste Clients", "Ajout Clients"]
    },
    {
      name: "Vente",
      icon: FiShoppingCart,
      menus: ["Liste Vente", "Ajout Vente"]
    },
  ]

  return (
    <div className=''>

      <div onClick={() => setIsOpen(false)} className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${isOpen ? "block" : "hidden"}`}>
      </div>

      <motion.div initial={{ x: isTab ? -250 : 0 }} variants={Sidebar_animation} animate={isOpen ? "open" : "closed"} className="bg-dark-second shadow-xl z-[999] w-[16rem] max-w-[16rem] h-screen overflow-hidden md:relative fixed">

        <Link className="flex items-center gap-3 font-medium border-b border-gray-line py-3 mx-3 text-decoration-none" >
          <img src={logo} className='w-[45px]' alt="" />
          <h1 className='text-xl whitespace-pre font-bold text-white'>Computer <span className='text-red-600 font-semibold'>Store</span></h1>
        </Link>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-none scrollbar-track-dark-second scrollbar-thumb-gray-line h-[70%] md:h-[68%] hover:scrollbar-thin" >
            <li>
              <NavLink className={'text-decoration-none text-textG link'} to={"/dashboard"} >
                <AiOutlineAppstore size={23} className="min-w-max" />
                Tableau de bord
              </NavLink>
            </li>

            {
              (isOpen || isTab) && (
                <div className="border-y py-[15px] border-gray-line">
                  <small className="pl-3 text-textG inline-block mb-2" >E-commerce</small>
                  {
                    subMenusList?.map(menu => (
                      <div key={menu.name} className="flex flex-col gap-1">
                        <SubMenu data={menu} />
                      </div>
                    ))
                  }
                  <NavLink className={'text-decoration-none text-textG link'} to={"/paiement"} >
                    <TbCashBanknote   size={23} className="min-w-max" />
                    Paiement
                  </NavLink>
                  <NavLink className={'text-decoration-none text-textG link'} to={"/rapport"} >
                    <IoAnalyticsOutline   size={23} className="min-w-max" />
                    Rapport
                  </NavLink>
                </div>
              )
            }

            {/* <li>
              <NavLink className={'text-decoration-none text-textG link'} to={"/notifications"} >
                <BiBell size={23} className="min-w-max" />
                Notifications
              </NavLink>
            </li> */}

            <li>
              <NavLink className={'text-decoration-none text-textG link'} to={"/historique"} >
                <AiOutlineHistory size={23} className="min-w-max" />
                Historique
              </NavLink>
            </li>
            {/* <li>
              <NavLink className={'text-decoration-none text-textG link'} to={"/parametres"} >
                <RiSettings4Line size={23} className="min-w-max" />
                Parametres
              </NavLink>
            </li> */}
          </ul>

          {
            isOpen && (<div className="flex-1 text-sm z-50 max-h-40 my-auto whitespace-pre w-full font-medium text-textG" >
              <div className="flex items-center justify-between border-y border-gray-line p-3 ">
                <div>
                  <p>Spark</p>
                  <small>No-cost</small>
                </div>
                <p className="text-teal-500 py-1.5 px-3 text-xs bg-teal-50 rounded-xl">
                  Upgrade
                </p>
              </div>
            </div>
            )}


        </div>

        <motion.div
          animate={
            isOpen ? {
              x: 0,
              y: 0,
              rotate: 0
            } : {
              x: -10,
              y: -200,
              rotate: 180
            }
          }
          transition={{
            duration: 0,
          }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer md:block hidden">
          <IoIosArrowBack size={25} className='text-white' />
        </motion.div>
      </motion.div>

      <div className="m-3 md:hidden text-textG" onClick={() => setIsOpen(true)}>
        <IoMdMenu size={25} />
      </div>

    </div>
  )
}

export default Sidebar
