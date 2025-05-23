import { lazy, useEffect, useRef, useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import ThemeToggleButton from '../Shared/ThemeToggleButton'
const ThemeToggleButton = lazy(() => import('../Shared/ThemeToggleButton'))
import { LucideShoppingBag, ShoppingBag } from 'lucide-react'
import { PiUserCircleDashedFill } from "react-icons/pi";
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../services/store/authServices';
import { motion } from "framer-motion"
import { clearFly } from '../../slices/globleSlice'
const navigation = [
  { name: 'Home ', href: '/', current: false },
  { name: 'Cart', href: '/user/cart', current: false },
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Cources', href: '/Cources', current: false },
  { name: 'Calendar', href: '/Calendar', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { isAuthenticated, role } = useSelector(state => state.authReducer);
  // const { close } = useDisclosureContext();
  const [logout, { isLoading, isError, isSuccess }] = useLogoutMutation();
  const cartIconRef = useRef();
  const dispatch = useDispatch();
  const { cartFly:{from,start},cartQty } = useSelector((state) => state.globle);
  
  const [to, setTo] = useState(null);
  useEffect(() => {
    if (cartIconRef?.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      setTo({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });
    }
  }, []);
  return (
    <Disclosure as="nav" className="scroll-hide z-50 border-b dark:border-light light:bg-light light:border-slate-400 drop-shadow-lg dark:bg-primary ">
      {from && to && start && (
        <motion.div
        key={Date.now()} 
          initial={{ x: from.x, y: from.y, opacity: 1, scale: 1 }}
          animate={{
            x: to?.x,
            y: to?.y,
            opacity: 0,
            scale: .5,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => dispatch(clearFly())}
          className="fixed  bg-blue-900 border rounded-full z-[9999] pointer-events-none p-2"

        >
          <ShoppingBag size={24} />
        </motion.div>
      )}
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-color hover:bg-gray-700  focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
            <ThemeToggleButton />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={({ isActive }) => classNames(
                      isActive ? 'bg-gray-900 text-white' : 'light:text-gray-600 hover:bg-gray-700 light:hover:text-white dark:text-light font-semibold',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}

                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="text-color focus:ring-1 rounded-full light:ring-gray-600 dark:ring-gray-300 p-1"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            <NavLink ref={cartIconRef} to={'/user/cart'} className={({ isActive }) =>
              ` ${isActive
                ? "ring-1"
                : ""} " p-1 ml-2 border-b border-l rounded gap-1 flex items-center justify-center    cursor-pointer text-color 
      "`
            }>

              <LucideShoppingBag className='size-[20px]' />
              <p className='text-sm'>{cartQty || 0}</p>
            </NavLink>
            {/* <ThemeToggleButton/> */}
            {
              //  {/* Profile dropdown */}

              isAuthenticated ? <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <Link
                      to={"/user/profile"}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem >
                    <button
                      onClick={() => logout()}
                      type='button'
                      className="w-full px-4 py-2 flex text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
                :
                // {/* login menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full light:bg-light dark:bg-primary hover:text-thicksky light:hover:text-gray-900 light:text-gray-500 text-gray-400 bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>


                      <PiUserCircleDashedFill className='size-8 rounded-full' />

                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in
                    light:bg-white dark:bg-slate-800
                    "
                  >

                    <MenuItem >
                      <Link
                        to={"/user/login"}
                        className="block px-4 py-2 text-sm dark:text-sky-200 text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        🔐 Login
                      </Link>
                    </MenuItem>
                    <MenuItem >
                      <Link
                        to={"/user/register"}
                        className="block px-4 py-2 text-sm dark:text-sky-200 text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        🧾 Register
                      </Link>
                    </MenuItem>



                  </MenuItems>
                </Menu>}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="group space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item, index) => (






            <NavLink
              key={index}
              to={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={({ isActive }) =>
                `block hover:light:text-white light:text-slate-600 dark:text-light rounded-md px-3 py-2 text-base font-medium  ${isActive ? ' bg-gray-900 light:text-white' : ' text-gray-300 hover:bg-gray-700 '} 
                 `
              }

            >

              {item.name}
            </NavLink>
            // </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
