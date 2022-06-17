import React, { useEffect } from "react";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { getAllCategory } from "actions/services/CategoryActions";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { getCurrentUser, logout, setCurrentUser } from "actions/services/UserActions";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Cart from "./Cart";
import { API_URL } from 'actions/constants/constants'
import Slide from "components/Slide/Slide";


function Header(props) {
  const [category, setCategory] = useState([]);
  const [keyword, setKeyword] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  // const profile = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth.auth);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(setCurrentUser(decoded));
      dispatch(getCurrentUser())
    }
  }, [dispatch, token]);

  const handleLogout = () => dispatch(logout());

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    getAllCategory()
      .then((res) => {
        setCategory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(keyword);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  return (
    <>
      <header className="header">
        <div className="grid wide">
          <nav className="header__navbar hide-on-mobile-tablet">
            <ul className="header__navbar--list">
              <li className="header__navbar--item">
              <svg width="89" height="27" viewBox="0 0 89 27" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#404145"><path d="m81.6 13.1h-3.1c-2 0-3.1 1.5-3.1 4.1v9.3h-6v-13.4h-2.5c-2 0-3.1 1.5-3.1 4.1v9.3h-6v-18.4h6v2.8c1-2.2 2.3-2.8 4.3-2.8h7.3v2.8c1-2.2 2.3-2.8 4.3-2.8h2zm-25.2 5.6h-12.4c.3 2.1 1.6 3.2 3.7 3.2 1.6 0 2.7-.7 3.1-1.8l5.3 1.5c-1.3 3.2-4.5 5.1-8.4 5.1-6.5 0-9.5-5.1-9.5-9.5 0-4.3 2.6-9.4 9.1-9.4 6.9 0 9.2 5.2 9.2 9.1 0 .9 0 1.4-.1 1.8zm-5.7-3.5c-.1-1.6-1.3-3-3.3-3-1.9 0-3 .8-3.4 3zm-22.9 11.3h5.2l6.6-18.3h-6l-3.2 10.7-3.2-10.8h-6zm-24.4 0h5.9v-13.4h5.7v13.4h5.9v-18.4h-11.6v-1.1c0-1.2.9-2 2.2-2h3.5v-5h-4.4c-4.3 0-7.2 2.7-7.2 6.6v1.5h-3.4v5h3.4z"></path></g><g fill="#1dbf73"><path d="m85.3 27c2 0 3.7-1.7 3.7-3.7s-1.7-3.7-3.7-3.7-3.7 1.7-3.7 3.7 1.7 3.7 3.7 3.7z"></path></g></svg>
              </li>
              <li className="header__navbar--item header__navbar--item-qr header__navbar-item--separate">
                Kênh Người Bán
                <div className="header__qr">
                  <img
                    src={`${API_URL}/images/qrcode.png`}
                    alt="Qr code"
                    className="header__qr-img"
                  />
                  <div className="header__qr-apps">
                    <Link to="/" className="header__qr-link">
                      <img
                        src={`${API_URL}/images/googleplay.png`}
                        alt="Goole Play"
                        className="header__qr-download-img"
                      />
                    </Link>
                    <Link to="/" className="header__qr-link">
                      <img
                        src={`${API_URL}/images/appstore.png`}
                        alt="App store"
                        className="header__qr-download-img"
                      />
                    </Link>
                  </div>
                </div>
              </li>
              <li className="header__navbar--item">
                <span className="header__navbar--item-title-no-pointer">
                  Trở thành Người bán
                </span>
                <Link to="/" className="nav--icon-link">
                  <i className="header__navbar-icon fab fa-facebook" />
                </Link>
                <Link to="/" className="nav--icon-link">
                  <i className="header__navbar-icon fab fa-instagram" />
                </Link>
              </li>
              <div className="header__search">
                <div className="header__search-input-wrap">
                  <input
                    type="text"
                    className="header__search-input"
                    placeholder="Nhập thông tin tìm kiếm"
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="header__search-btn"
                  onClick={() => {
                    history.push(`/search?keyword=${keyword}`);
                  }}
                >
                  <i className="header__search-btn-icon fas fa-search" />
                </button>
              </div>
            </ul>
            <ul className="header__navbar--list">
              <li className="header__navbar--item">
                <Link to="/about-us" className="nav--link">
                  <i className="header__navbar-icon far fa-question-circle" />
                  Về chúng tôi
                </Link>
              </li>
              <li className="header__navbar--item">
                <Link to="/help" className="nav--link">
                  <i className="header__navbar-icon far fa-question-circle" />
                  Trợ giúp
                </Link>
              </li>

              {token ? (
                <li className="header__navbar--item header__navbar-user">
                  <AccountCircleIcon />
                  <span className="header__navbar-user-name">
                    {auth.fullName}
                  </span>
                  <ul className="header__navbar-user-menu">
                    <li className="header__navbar-user-item">
                      <Link to="/customer/account">Tài khoản của tôi</Link>
                    </li>
                    <li className="header__navbar-user-item">
                      <Link to="/customer/address">Địa chỉ của tôi</Link>
                    </li>
                    <li className="header__navbar-user-item">
                      <Link to="/customer/order/history">Đơn mua</Link>
                    </li>
                    <li className="header__navbar-user-item header__navbar-user-item-separate">
                      <Link to="#" onClick={handleLogout}>
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="header__navbar--item navbar--strong header__navbar-item--separate">
                    <Link
                      to="/register"
                      className="nav--link nav--link-register"
                    >
                      Đăng ký
                    </Link>
                  </li>
                  <li className="header__navbar--item navbar--strong">
                    <Link to="/login" className="nav--link nav--link-login">
                      Đăng nhập
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <Cart />
            
          </nav>

          <div className="header-width-search">
            <div className="header__logo">
              {/* <a href="/" className="header__logo-link">
                <img src="https://daipro.xyz/wp-content/uploads/2022/04/logo_tgdd.png" alt="" />
              </a> */}
            </div>
            <div className="header__category">

              <div className="header__category--dropdown">
                <ul className="header__category--list">
                  {category.map((item) => {
                    return (
                      <li className="header__category--item" key={item.id}>
                        <Link
                          to={`/${item.code}`}
                          className="header__category--link"
                        >
                          <i className="fas fa-bolt"></i>
                          {item.name}
                        </Link>
                        <div className="header__category--item-dropdown">
                          <h3 className="header__category--item-title">
                            {item.name}
                          </h3>
                          <ul className="header__category--item-sublist">
                            {item?.subcategories.map((sub) => {
                              return (
                                <li
                                  className="header__category--item-subitem"
                                  key={sub.id}
                                >
                                  <Link
                                    to={`/${item.code}/${sub.code}`}
                                    className="header__category--item-link"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ul className="header__sort-bar">
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Liên quan
            </Link>
          </li>
          <li className="header__sort-item header__sort-item-active">
            <Link to="/" className="header__sort-link">
              Mới nhất
            </Link>
          </li>
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Bán chạy
            </Link>
          </li>
          <li className="header__sort-item">
            <Link to="/" className="header__sort-link">
              Giá
            </Link>
          </li>
        </ul>
      </header>
      <Slide/>
      {/* <ProductHeader/> */}
    </>
  );
}

export default Header;
