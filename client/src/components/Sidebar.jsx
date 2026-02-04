import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Evidence List', href: '/evidence', icon: DocumentDuplicateIcon },
  { name: 'Upload Evidence', href: '/upload', icon: CloudArrowUpIcon },
  { name: 'User Management', href: '/users', icon: UsersIcon },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const filteredNavigation = navigation.filter(
    (item) => item.href !== '/users' || user?.role === 'Admin'
  );

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex flex-col px-6 pb-4 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">ForenChain</div>
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col">
                    <nav className="flex-1 space-y-1">
                      {filteredNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`${
                            location.pathname === item.href
                              ? 'bg-blue-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-blue-700'
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ForenChain</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-gray-600 hover:bg-blue-700 hover:text-white dark:text-gray-300'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Logout
              </button>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}