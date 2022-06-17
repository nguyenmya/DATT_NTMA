import { makeStyles } from "@material-ui/core";
import React from "react";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./sidebar.css";
import { SidebarConfig, SIDEBAR_SHIPPER } from "./SidebarConfig";

const useStyles = makeStyles({
  sidebar: {
    background: "#fff",
    color: "#fff",
    height: "inherit",
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 75
  }
});

const Sidebar = (props) => {
  const classes = useStyles();
  const {role} = props;

  const SIDEBAR = atob(role) === 'ROLE_ADMIN' ? SidebarConfig : SIDEBAR_SHIPPER;

  const open = useSelector((state) => state.ThemeReducer.open);

  return (
    <>
      <div className={`sidebar ${open ? 'open' : 'close'}`}>
        <ProSidebar className={classes.sidebar}>
          <SidebarHeader>
            <div className="sidebar__logo">
              <Link to="/">
                <img src="https://taobao.vn/Uploads/NewsIMG/8-5-2021-52055-PM.png" alt=""  style={{width:"240px"}}/>

                MYA
                {/* <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fchanhtuoi.com%2Flogo-lazada-p2413.html&psig=AOvVaw2OucxHv9YbQ-o2x5096y5Y&ust=1650549082448000&source=images&cd=vfe&ved=2ahUKEwi8hZzP5KL3AhUWBd4KHdUfCucQr4kDegUIARDHAQ"  alt="" /> */}
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              {SIDEBAR.map((item) => {
                if (item.children) {
                  return (
                    <SubMenu
                      title={item.display_name}
                      icon={<i className={item.icon}></i>}
                      key={item.display_name}
                    >
                      {item.children.map((child) => {
                        return (
                          <MenuItem
                            key={child.display_name}
                            icon={<i className={child.icon}></i>}
                          >
                            {child.display_name}
                            <Link to={child.route} />
                          </MenuItem>
                        );
                      })}
                    </SubMenu>
                  );
                }
                return (
                  <MenuItem
                    icon={<i className={item.icon}></i>}
                    key={item.display_name}
                  >
                    {item.display_name}
                    <Link to={item.route} />
                  </MenuItem>
                );
              })}
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <h3 className={classes.text}>Trang quản trị</h3>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Sidebar;
