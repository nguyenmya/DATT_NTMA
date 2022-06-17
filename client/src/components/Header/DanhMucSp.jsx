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
function DanhMucSp(props) {
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

    return (
        <>
            <header className="">
                <div className="grid wide">

                    <div className="header-width-search">

                        <div className="header__category">

                            <div className="">
                                <ul className="" style={{border:"1px solid black"}}>
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

                        {/* <Cart /> */}
                    </div>
                </div>

            </header>
        </>
    );
}

export default DanhMucSp;
