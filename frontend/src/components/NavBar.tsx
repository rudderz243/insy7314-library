import React from "react";
import { NavLink } from "react-router-dom";

export const NavBar: React.FC = () => {
  return (
    /* the <nav> container holds all the navigation objects for our navbar */
    <nav className='navbar'>
      {/* a <div> is just a container that holds multiple objects */}
      <div className='nav-brand'>
        <span>Public Library App Thing</span>
      </div>

      <div className='nav-links'>
        {/* the styling for the navlinks is conditional, the style will change based on which link is active */}
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link"
          }
        >
          Book Management Page
        </NavLink>
        <NavLink
          to='/health'
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link"
          }
        >
          Backend Status
        </NavLink>
      </div>
    </nav>
  );
};
