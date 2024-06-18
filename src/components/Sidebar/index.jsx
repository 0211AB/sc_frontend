import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="text-title-md font-bold text-white text-center w-full">
          SARAFF CREATIONS
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {() => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                          pathname.includes('dashboard')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Dashboard
                      </NavLink>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>


              <SidebarLinkGroup
                activeCondition={
                  pathname === '/products' || pathname.includes('products')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/products' ||
                          pathname.includes('products')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9756)">
                            <path
                              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9756">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>

                        Products
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/products/all"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              All Products
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/products/new"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add New Product
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/products/categories"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Categories
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <NavLink
                  to="/clients"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M14.948 1.25H17.052C17.9505 1.24997 18.6997 1.24995 19.2945 1.32991C19.9223 1.41432 20.4891 1.59999 20.9445 2.05546C21.4 2.51093 21.5857 3.07773 21.6701 3.70552C21.7501 4.30031 21.75 5.04953 21.75 5.94801V21.25H22C22.4142 21.25 22.75 21.5858 22.75 22C22.75 22.4142 22.4142 22.75 22 22.75H2C1.58579 22.75 1.25 22.4142 1.25 22C1.25 21.5858 1.58579 21.25 2 21.25H2.25L2.25 8.948C2.24997 8.04952 2.24994 7.3003 2.32991 6.70552C2.41432 6.07773 2.59999 5.51093 3.05546 5.05546C3.51093 4.59999 4.07773 4.41432 4.70552 4.32991C5.3003 4.24995 6.04952 4.24997 6.948 4.25L10.278 4.25C10.3294 3.37583 10.4906 2.62032 11.0555 2.05546C11.5109 1.59999 12.0777 1.41432 12.7055 1.32991C13.3003 1.24995 14.0495 1.24997 14.948 1.25ZM11.0068 5.75C11.0055 5.75 11.0043 5.75 11.003 5.75C11.002 5.75 11.001 5.75 11 5.75H7C6.03599 5.75 5.38843 5.7516 4.90539 5.81654C4.44393 5.87858 4.24643 5.9858 4.11612 6.11612C3.9858 6.24644 3.87858 6.44393 3.81654 6.90539C3.75159 7.38843 3.75 8.03599 3.75 9V21.25H8.25V19C8.25 18.5858 8.58579 18.25 9 18.25C9.41421 18.25 9.75 18.5858 9.75 19V21.25H14.25V9C14.25 8.03599 14.2484 7.38843 14.1835 6.90539C14.1214 6.44393 14.0142 6.24644 13.8839 6.11612C13.7536 5.9858 13.5561 5.87858 13.0946 5.81654C12.6127 5.75175 11.9671 5.75001 11.0068 5.75ZM15.75 21.25L15.75 8.94801C15.75 8.04953 15.7501 7.30031 15.6701 6.70552C15.5857 6.07773 15.4 5.51093 14.9445 5.05546C14.4891 4.59999 13.9223 4.41432 13.2945 4.32991C12.8691 4.27273 12.3648 4.25645 11.7834 4.25183C11.8335 3.55219 11.9436 3.28863 12.1161 3.11612C12.2464 2.9858 12.4439 2.87858 12.9054 2.81654C13.3884 2.7516 14.036 2.75 15 2.75H17C17.964 2.75 18.6116 2.7516 19.0946 2.81654C19.5561 2.87858 19.7536 2.9858 19.8839 3.11612C20.0142 3.24644 20.1214 3.44393 20.1835 3.90539C20.2484 4.38843 20.25 5.03599 20.25 6V21.25H15.75ZM5.25 8C5.25 7.58579 5.58579 7.25 6 7.25H12C12.4142 7.25 12.75 7.58579 12.75 8C12.75 8.41422 12.4142 8.75 12 8.75H6C5.58579 8.75 5.25 8.41422 5.25 8ZM5.25 11C5.25 10.5858 5.58579 10.25 6 10.25H12C12.4142 10.25 12.75 10.5858 12.75 11C12.75 11.4142 12.4142 11.75 12 11.75H6C5.58579 11.75 5.25 11.4142 5.25 11ZM5.25 14C5.25 13.5858 5.58579 13.25 6 13.25H12C12.4142 13.25 12.75 13.5858 12.75 14C12.75 14.4142 12.4142 14.75 12 14.75H6C5.58579 14.75 5.25 14.4142 5.25 14Z" fill="#ffffff"></path> </g></svg>
                  Clients
                </NavLink>
              </li>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/quotations' || pathname.includes('quotations')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/quotations' ||
                          pathname.includes('quotations')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M7.09878 1.25004C7.14683 1.25006 7.19559 1.25008 7.24508 1.25008H16.7551C16.8045 1.25008 16.8533 1.25006 16.9014 1.25004C17.9181 1.2496 18.6178 1.24929 19.2072 1.45435C20.3201 1.84161 21.1842 2.73726 21.5547 3.86559L20.8421 4.09954L21.5547 3.86559C21.7507 4.46271 21.7505 5.17254 21.7501 6.22655C21.7501 6.27372 21.7501 6.32158 21.7501 6.37014V20.3743C21.7501 21.8395 20.0231 22.7118 18.8857 21.671C18.8062 21.5983 18.694 21.5983 18.6145 21.671L18.1314 22.1131C17.2032 22.9624 15.7969 22.9624 14.8688 22.1131C14.5138 21.7882 13.9864 21.7882 13.6314 22.1131C12.7032 22.9624 11.2969 22.9624 10.3688 22.1131C10.0138 21.7882 9.48637 21.7882 9.13138 22.1131C8.20319 22.9624 6.79694 22.9624 5.86875 22.1131L5.38566 21.671C5.30618 21.5983 5.19395 21.5983 5.11448 21.671C3.97705 22.7118 2.25007 21.8395 2.25007 20.3743V6.37014C2.25007 6.32158 2.25005 6.27372 2.25003 6.22655C2.24965 5.17255 2.24939 4.46271 2.44545 3.86559C2.81591 2.73726 3.68002 1.84161 4.79298 1.45435C5.3823 1.24929 6.08203 1.2496 7.09878 1.25004ZM7.24508 2.75008C6.024 2.75008 5.6034 2.76057 5.28593 2.87103C4.62655 3.10047 4.09919 3.63728 3.8706 4.3335C3.75951 4.67183 3.75007 5.11796 3.75007 6.37014V20.3743C3.75007 20.4933 3.80999 20.5661 3.88517 20.6009C3.92434 20.619 3.96264 20.6237 3.99456 20.6194C4.0227 20.6156 4.05911 20.6035 4.10185 20.5644C4.75453 19.9671 5.74561 19.9671 6.39828 20.5644L6.88138 21.0065C7.23637 21.3313 7.76377 21.3313 8.11875 21.0065C9.04694 20.1571 10.4532 20.1571 11.3814 21.0065C11.7364 21.3313 12.2638 21.3313 12.6188 21.0065C13.5469 20.1571 14.9532 20.1571 15.8814 21.0065C16.2364 21.3313 16.7638 21.3313 17.1188 21.0065L17.6019 20.5644C18.2545 19.9671 19.2456 19.9671 19.8983 20.5644C19.941 20.6035 19.9774 20.6156 20.0056 20.6194C20.0375 20.6237 20.0758 20.619 20.115 20.6009C20.1901 20.5661 20.2501 20.4934 20.2501 20.3743V6.37014C20.2501 5.11797 20.2406 4.67183 20.1295 4.3335C19.9009 3.63728 19.3736 3.10047 18.7142 2.87103C18.3967 2.76057 17.9761 2.75008 16.7551 2.75008H7.24508ZM6.25007 7.50008C6.25007 7.08587 6.58585 6.75008 7.00007 6.75008H7.50007C7.91428 6.75008 8.25007 7.08587 8.25007 7.50008C8.25007 7.9143 7.91428 8.25008 7.50007 8.25008H7.00007C6.58585 8.25008 6.25007 7.9143 6.25007 7.50008ZM9.75007 7.50008C9.75007 7.08587 10.0859 6.75008 10.5001 6.75008H17.0001C17.4143 6.75008 17.7501 7.08587 17.7501 7.50008C17.7501 7.9143 17.4143 8.25008 17.0001 8.25008H10.5001C10.0859 8.25008 9.75007 7.9143 9.75007 7.50008ZM6.25007 11.0001C6.25007 10.5859 6.58585 10.2501 7.00007 10.2501H7.50007C7.91428 10.2501 8.25007 10.5859 8.25007 11.0001C8.25007 11.4143 7.91428 11.7501 7.50007 11.7501H7.00007C6.58585 11.7501 6.25007 11.4143 6.25007 11.0001ZM9.75007 11.0001C9.75007 10.5859 10.0859 10.2501 10.5001 10.2501H17.0001C17.4143 10.2501 17.7501 10.5859 17.7501 11.0001C17.7501 11.4143 17.4143 11.7501 17.0001 11.7501H10.5001C10.0859 11.7501 9.75007 11.4143 9.75007 11.0001ZM6.25007 14.5001C6.25007 14.0859 6.58585 13.7501 7.00007 13.7501H7.50007C7.91428 13.7501 8.25007 14.0859 8.25007 14.5001C8.25007 14.9143 7.91428 15.2501 7.50007 15.2501H7.00007C6.58585 15.2501 6.25007 14.9143 6.25007 14.5001ZM9.75007 14.5001C9.75007 14.0859 10.0859 13.7501 10.5001 13.7501H17.0001C17.4143 13.7501 17.7501 14.0859 17.7501 14.5001C17.7501 14.9143 17.4143 15.2501 17.0001 15.2501H10.5001C10.0859 15.2501 9.75007 14.9143 9.75007 14.5001Z" fill="#ffffff"></path> </g></svg>

                        Quotations
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/quotations/all"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              All Quotations
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/quotations/new"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              New Quotation
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/invoices' || pathname.includes('invoices')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/invoices' ||
                          pathname.includes('invoices')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >

                        <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.0368 5.31932 22.374 6.16313 22.5484 7.19112C22.6758 7.94158 22.7222 8.82957 22.7395 9.87437C22.7464 9.91522 22.75 9.95719 22.75 10C22.75 10.0353 22.7476 10.07 22.7428 10.104C22.7464 10.3904 22.7482 10.6882 22.7491 10.9978C22.7503 11.412 22.4155 11.7488 22.0013 11.75C21.5871 11.7512 21.2503 11.4164 21.2491 11.0022C21.2488 10.9168 21.2485 10.8328 21.2481 10.75H2.75199C2.75009 11.1384 2.75 11.5541 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02502 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H11.5C11.9142 19.25 12.25 19.5858 12.25 20C12.25 20.4142 11.9142 20.75 11.5 20.75H9.94359C8.10583 20.75 6.65019 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24999 11.2818 1.24999 10.6696 1.25714 10.1039C1.25243 10.0699 1.25 10.0352 1.25 10C1.25 9.95716 1.25359 9.91517 1.26049 9.87429C1.27564 8.96711 1.31267 8.18385 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10582 3.24998 9.94358 3.25ZM2.77607 9.25H21.2238C21.1999 8.53519 21.1547 7.9438 21.0696 7.44205C20.9267 6.60017 20.6831 6.08692 20.2981 5.7019C19.8749 5.27869 19.2952 5.02502 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976C4.70476 5.02502 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02502 6.70476 2.88976 7.71085C2.82987 8.15634 2.79564 8.66327 2.77607 9.25ZM15.5 13.25C15.9142 13.25 16.25 13.5858 16.25 14V18.1893L16.9697 17.4697C17.2626 17.1768 17.7374 17.1768 18.0303 17.4697C18.3232 17.7626 18.3232 18.2374 18.0303 18.5303L16.0303 20.5303C15.7374 20.8232 15.2626 20.8232 14.9697 20.5303L12.9697 18.5303C12.6768 18.2374 12.6768 17.7626 12.9697 17.4697C13.2626 17.1768 13.7374 17.1768 14.0303 17.4697L14.75 18.1893V14C14.75 13.5858 15.0858 13.25 15.5 13.25ZM19.4697 13.4697C19.7626 13.1768 20.2374 13.1768 20.5303 13.4697L22.5303 15.4697C22.8232 15.7626 22.8232 16.2374 22.5303 16.5303C22.2374 16.8232 21.7626 16.8232 21.4697 16.5303L20.75 15.8107V20C20.75 20.4142 20.4142 20.75 20 20.75C19.5858 20.75 19.25 20.4142 19.25 20V15.8107L18.5303 16.5303C18.2374 16.8232 17.7626 16.8232 17.4697 16.5303C17.1768 16.2374 17.1768 15.7626 17.4697 15.4697L19.4697 13.4697ZM5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H10C10.4142 15.25 10.75 15.5858 10.75 16C10.75 16.4142 10.4142 16.75 10 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16Z" fill="#ffffff"></path> </g></svg>

                        Invoice
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/invoices/all"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              All Invoices
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/invoices/new"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              New Invoice
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/products' || pathname.includes('products')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/challans' ||
                          pathname.includes('challans')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >

                        <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M18.0909 2.54877C17.5385 2.23946 16.9504 2.20831 16.3288 2.286C15.7383 2.3598 15.02 2.54651 14.1567 2.7709L12.1384 3.2954C11.2755 3.51963 10.557 3.70634 10.0072 3.92891C9.4292 4.16293 8.92943 4.47736 8.60526 5.02195C8.27903 5.56998 8.24664 6.15584 8.32794 6.76777C8.40459 7.34473 8.59805 8.04488 8.82853 8.87901L9.37108 10.8429C9.60161 11.6775 9.79499 12.3775 10.0259 12.9139C10.271 13.4835 10.5985 13.9684 11.1541 14.2795C11.7064 14.5888 12.2945 14.62 12.9162 14.5423C13.5066 14.4685 14.225 14.2818 15.0882 14.0574L17.1066 13.5329C17.9695 13.3086 18.688 13.1219 19.2377 12.8994C19.8157 12.6653 20.3155 12.3509 20.6397 11.8063C20.9659 11.2583 20.9983 10.6724 20.917 10.0605C20.8403 9.48355 20.6469 8.7834 20.4164 7.94926L19.8738 5.98536C19.6433 5.1508 19.4499 4.45076 19.2191 3.91434C18.9739 3.34477 18.6465 2.85989 18.0909 2.54877ZM14.485 4.2354C15.4099 3.99503 16.0331 3.83463 16.5148 3.77442C16.9764 3.71673 17.1974 3.7676 17.358 3.85754C17.5154 3.94567 17.6656 4.09931 17.8413 4.50734C18.0265 4.93768 18.1937 5.53684 18.442 6.43548L18.9564 8.29754C19.2048 9.19641 19.3687 9.79611 19.4301 10.2581C19.4883 10.6968 19.4362 10.8956 19.3508 11.0391C19.2633 11.186 19.1047 11.3349 18.6748 11.509C18.2271 11.6903 17.605 11.8535 16.6798 12.0939L14.76 12.5929C13.835 12.8333 13.2118 12.9937 12.7301 13.0539C12.2685 13.1116 12.0476 13.0607 11.8869 12.9707C11.7296 12.8826 11.5793 12.729 11.4037 12.3209C11.2185 11.8906 11.0512 11.2914 10.8029 10.3928L10.2885 8.53074C10.0402 7.63187 9.87625 7.03217 9.81487 6.57022C9.75658 6.13148 9.80876 5.93269 9.89418 5.78921C9.98164 5.64227 10.1402 5.49334 10.5701 5.31928C11.0179 5.138 11.64 4.97476 12.5651 4.73434L14.485 4.2354Z" fill="#ffffff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M3.2007 4.72469C2.80157 4.61396 2.38823 4.84775 2.27749 5.24688C2.16675 5.64602 2.40054 6.05936 2.79968 6.17009L4.50338 6.64278C4.92898 6.76086 5.24592 7.08236 5.35419 7.47427L7.3055 14.5374C7.23053 14.5521 7.1556 14.5692 7.0808 14.5887C5.10375 15.1025 3.89563 17.0913 4.43836 19.0558C4.97848 21.0108 7.03215 22.1384 9.00137 21.6266C10.7247 21.1788 11.8638 19.6102 11.7683 17.9139L20.1888 15.7256C20.5897 15.6214 20.8303 15.2119 20.7261 14.811C20.6219 14.4101 20.2124 14.1696 19.8115 14.2738L11.3734 16.4667C10.8651 15.4794 9.93146 14.7927 8.86688 14.5562L6.80003 7.07483C6.5469 6.1586 5.82129 5.45177 4.9044 5.19738L3.2007 4.72469ZM7.45809 16.0404C8.66981 15.7255 9.88575 16.4288 10.198 17.5589C10.5076 18.6796 9.82797 19.862 8.62408 20.1748C7.41235 20.4897 6.19641 19.7864 5.8842 18.6563C5.5746 17.5357 6.25419 16.3533 7.45809 16.0404Z" fill="#ffffff"></path> </g></svg>

                        Challans
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/challans/all"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              All Challans
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/challans/new"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              New Challan
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/brochures' || pathname.includes('brochures')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/brochures' ||
                          pathname.includes('brochures')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg height="20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.7276 12.8181C19.6271 12.4163 19.2199 12.172 18.8181 12.2724L14.8181 13.2724C14.4163 13.3729 14.1719 13.7801 14.2724 14.1819C14.3729 14.5838 14.7801 14.8281 15.1819 14.7276L19.1819 13.7276C19.5837 13.6272 19.8281 13.22 19.7276 12.8181Z" fill="#ffffff"></path> <path d="M19.75 5.50004C19.75 5.08582 19.4142 4.75004 19 4.75004C18.5858 4.75004 18.25 5.08582 18.25 5.50004V8.93863L17.5007 8.58269L17.4919 8.57825C17.4429 8.55319 17.2363 8.4476 17 8.4476C16.7637 8.4476 16.5571 8.55319 16.5081 8.57825L16.4993 8.58269L15.75 8.93863V6.95006C15.75 6.53584 15.4142 6.20006 15 6.20006C14.5858 6.20006 14.25 6.53584 14.25 6.95006L14.25 9.53724C14.2498 9.64846 14.2496 9.80702 14.2709 9.94314C14.2969 10.1096 14.3824 10.4308 14.7151 10.6261C15.0355 10.8143 15.3488 10.7444 15.4978 10.6981C15.6276 10.6577 15.77 10.5899 15.8762 10.5393L17 10.0055L18.1238 10.5393C18.23 10.5899 18.3724 10.6577 18.5022 10.6981C18.6512 10.7444 18.9645 10.8143 19.2849 10.6261C19.6176 10.4308 19.7031 10.1096 19.7291 9.94314C19.7504 9.80702 19.7502 9.64846 19.75 9.53724L19.75 5.50004Z" fill="#ffffff"></path> <path d="M4.27239 8.81813C4.37285 8.41629 4.78006 8.17197 5.1819 8.27243L9.1819 9.27243C9.58375 9.37289 9.82807 9.78009 9.72761 10.1819C9.62715 10.5838 9.21994 10.8281 8.8181 10.7276L4.8181 9.72764C4.41625 9.62718 4.17193 9.21998 4.27239 8.81813Z" fill="#ffffff"></path> <path d="M5.1819 12.2724C4.78006 12.172 4.37285 12.4163 4.27239 12.8181C4.17193 13.22 4.41625 13.6272 4.8181 13.7276L8.8181 14.7276C9.21994 14.8281 9.62715 14.5838 9.72761 14.1819C9.82807 13.7801 9.58375 13.3729 9.1819 13.2724L5.1819 12.2724Z" fill="#ffffff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M22.75 4.93323C22.75 3.46992 21.5847 2.21498 20.0559 2.26824C18.9175 2.30789 17.4296 2.4263 16.2849 2.76899C15.2899 3.06687 14.1706 3.64872 13.2982 4.15366C12.4801 4.62712 11.4617 4.65074 10.6328 4.21248C9.63736 3.68609 8.32766 3.06215 7.19136 2.7623C6.23055 2.50876 5.01517 2.38698 4.02841 2.32634C2.47017 2.23057 1.25 3.49868 1.25 4.99784V16.1436C1.25 17.6798 2.49378 18.8792 3.96804 18.9714C4.9268 19.0314 6.00566 19.1467 6.80864 19.3586C7.8012 19.6205 9.0286 20.2029 10.0196 20.7311C11.2529 21.3885 12.7471 21.3885 13.9804 20.7311C14.9714 20.2029 16.1988 19.6205 17.1914 19.3586C17.9943 19.1467 19.0732 19.0314 20.032 18.9714C21.5062 18.8792 22.75 17.6798 22.75 16.1436V4.93323ZM20.1081 3.76733C20.7229 3.74591 21.25 4.25164 21.25 4.93323V16.1436C21.25 16.8294 20.6817 17.4278 19.9383 17.4743C18.9582 17.5356 17.7591 17.6574 16.8086 17.9082C15.6383 18.2171 14.2827 18.8701 13.2748 19.4074C13.1065 19.4971 12.9305 19.5678 12.75 19.6194V5.94207C13.2023 5.85153 13.6421 5.68771 14.0495 5.45191C14.9 4.95972 15.8949 4.45152 16.7151 4.20597C17.6643 3.92182 18.9892 3.8063 20.1081 3.76733ZM11.25 5.97501C10.795 5.90426 10.349 5.75918 9.93167 5.53851C8.95486 5.022 7.77076 4.46654 6.80864 4.21266C5.99643 3.99833 4.90238 3.88288 3.93639 3.82351C3.30243 3.78455 2.75 4.30065 2.75 4.99784V16.1436C2.75 16.8294 3.31831 17.4278 4.06168 17.4743C5.04176 17.5356 6.24092 17.6574 7.19136 17.9082C8.3617 18.2171 9.71727 18.8701 10.7252 19.4074C10.8935 19.4971 11.0695 19.5678 11.25 19.6194V5.97501Z" fill="#ffffff"></path> </g></svg>
                        Brochures
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/brochures/all"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              All Brochures
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/brochures/new"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Create New Brochure
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

            </ul>
          </div>

          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/auth' || pathname.includes('auth')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/auth' || pathname.includes('auth')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9814)">
                            <path
                              d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                              fill=""
                            />
                            <path
                              d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9814">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Authentication
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/auth/signin"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Sign In
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/auth/signup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Sign Up
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
