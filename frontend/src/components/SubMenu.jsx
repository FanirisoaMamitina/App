import React, { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'


function SubMenu({data}) {

    const { pathname } = useLocation()
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    
  return (
    <>
        <li className={`link text-textG ${pathname.includes(data.name) && "text-red-500"}`} onClick={() => setSubMenuOpen(!subMenuOpen)}>
            <data.icon size={23} className="min-w-max" />
            <p className="capitalize flex-1 -mb-0">{data.name}</p>
            <IoIosArrowForward className={`${subMenuOpen && 'rotate-90'} duration-200`} />
        </li>
        <motion.ul
         animate={
            subMenuOpen ? {
                height: 'fit-content'
            }:{
                height: 0,
            }
         }
         className="flex flex-col pl-14 text-[0.8rem] font-normal overflow-hidden h-0">
            {
                data.menus.map( menu => (
                    <li key={menu}>
                        <NavLink to={`/${data.name}/${menu}`} className={"link capitalize text-decoration-none text-textG"} >
                            {menu}
                        </NavLink>
                    </li>
                ))
            }
        </motion.ul>
    </>
  )
}

export default SubMenu
