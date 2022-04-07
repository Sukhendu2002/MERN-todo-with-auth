import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import ReactNiceAvatar, {
  AvatarFullConfig,
  genConfig,
} from "react-nice-avatar";
import { useHistory, Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const config = {
    bgColor: "transparent",
    shape: "circle",
  };
  const myConfig = genConfig(config);
  const toggle = () => setIsOpen(!isOpen);
  let history = useHistory();

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand className="header">
          <strong>TODO APP</strong>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              {
                //only show when the user login

                true ? (
                  <Link to="/profile">
                    <ReactNiceAvatar
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        marginRight: "1rem",
                        cursor: "pointer",
                      }}
                      {...myConfig}
                    />
                  </Link>
                ) : (
                  <NavLink>Login</NavLink>
                )
              }
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
