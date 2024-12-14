import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { BiSolidDollarCircle } from 'react-icons/bi';
import { IoMdCash } from 'react-icons/io';
import { IoCash, IoCashSharp, IoEyeSharp, IoPrintOutline } from "react-icons/io5";
import { PiCashRegister, PiCashRegisterFill, PiCashRegisterThin } from 'react-icons/pi';
import { Link } from 'react-router-dom';

export default function Action({ data }) {
  return (
    <div className=" text-center">
      <Menu>
        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Options
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 rounded-xl border border-white/5 bg-dark-second p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <Link to={`/Vente/Details/${data.id}`} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-decoration-none text-white">
              <IoEyeSharp className="size-4 fill-white/30" />
              Voir
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘V</kbd>
            </Link>
          </MenuItem>
          {!(data.MontantRestant == 0 && data.Status === "soldée") &&
            <MenuItem>
              <Link to={`/AddPaiement/${data.id}`} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-decoration-none text-white">
                <IoMdCash className="size-4 fill-white/30" />
                Paiement
                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘P</kbd>
              </Link>
            </MenuItem>
          }

          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <TrashIcon className="size-4 fill-white/30" />
              Delete
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}
