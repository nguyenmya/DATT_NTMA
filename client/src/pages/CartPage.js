import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link, useHistory } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { deleteItemInCart, getCartInfo, getDetailCart, updateQuantityItem, checkQuantityItemInCart, selectedItemToOrder } from 'actions/services/CartActions'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; import Loading from 'components/Loading/Loading';
import useTimeout from 'hooks/useTimeout';
;

function CartPage(props) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const handleDeleteItem = (product_id) => {
        deleteItemInCart(product_id)
            .then((res) => {
                toast.info(res.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch(getCartInfo())
                dispatch(getDetailCart());
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUpdateItem = (item, quantity) => {
        const data = {
            cart_details: [{
                product_id: item?.product_id,
                quantity
            }]
        }
        // dispatch(updateQuantityItem(data))
        updateQuantityItem(data)
            .then((res) => {
                if (res.message !== "SUCCESS") {
                    toast.info(res.message, {
                        position: "bottom-center",
                        theme: 'dark',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                dispatch(getCartInfo())
                dispatch(getDetailCart());
            })
            .catch((err) => {
                toast.warning(err, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    const token = localStorage.getItem('token');

    const checkQuantity = () => {
        checkQuantityItemInCart(cart)
            .then((res) => {
                if (res.message === "SUCCESS") {
                    history.push("/checkout/payment")
                } else {
                    toast.info(res.message, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(() => {
                toast.error('Thao t??c kh??ng th??nh c??ng!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    useEffect(() => {

        document.title = "Gi??? h??ng | Tiki"

        if (token) {
            dispatch(getDetailCart())
        } else {
            props.history.push('/login');
        }
    }, [dispatch, props.history, token])

    const handleCheckedItemToOrder = (id) => {
        selectedItemToOrder(id)
            .then(() => dispatch(getDetailCart()))
            .catch(err => console.log(err))
            
    }

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="bkMhdM">
                            <h4 className="productsV2__title">Gi??? h??ng</h4>
                            {
                                loading ? <Loading /> : (
                                    <>
                                        {
                                            cart?.cart_details && cart?.cart_details.length > 0 ? (
                                                <div className="row sm-gutter">
                                                    <div className="col l-9 m-12 c-12">
                                                        <div className="productsV2-heading">
                                                            <div className="row">
                                                                <div className="col-1">
                                                                    <label className="kKoWwZ">
                                                                        <span className="label">{cart?.items_count} s???n ph???m</span>
                                                                    </label>
                                                                </div>
                                                                <div className="col-2">????n gi??</div>
                                                                <div className="col-3">S??? l?????ng</div>
                                                                <div className="col-4">Th??nh ti???n</div>
                                                                <div className="col-5">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="productsV2-content">
                                                            <div className="infinite-scroll-component " style={{ height: 'auto', overflow: 'auto' }}>
                                                                <div className="jfwAio">
                                                                    <div className="sellers">
                                                                        <ul className="fhrjkV">
                                                                            {
                                                                                cart?.cart_details.map((item, index) => {
                                                                                    return (
                                                                                        <li className="iMeYki" key={index}>
                                                                                            <div className="row">
                                                                                                <div className="col-1">
                                                                                                    <div className="intended__images">
                                                                                                        <div className="intended__checkbox">
                                                                                                            <label className="intended__checkbox-label">
                                                                                                                <input type="checkbox" readOnly checked={item.selected === 1} />
                                                                                                                <span className="checkbox-fake" onClick={() => handleCheckedItemToOrder(item.product_id)}></span>
                                                                                                            </label>
                                                                                                        </div>
                                                                                                        <Link className="intended__img" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                            <img src={item.mainImage} alt="" />
                                                                                                        </Link>
                                                                                                        <div className="intended__content">
                                                                                                            <Link className="intended__name" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                                {item.name}
                                                                                                            </Link>
                                                                                                            <span className="intended__not-bookcare">{item?.category.name}</span>
                                                                                                            <span className="intended__not-bookcare">{item?.brand.name}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2">
                                                                                                    <span className="intended__real-prices">{currency(item.price)}</span>
                                                                                                    <del className="intended__discount-prices">{currency(item.list_price)}</del>
                                                                                                </div>
                                                                                                <div className="col-3">
                                                                                                    <div className="intended-qty">
                                                                                                        <div className="bcFTqg">
                                                                                                            <span className="qty-decrease" onClick={() => handleUpdateItem(item, item.quantity - 1)}>
                                                                                                                <img src={`${API_URL}/images/decrease.png`} alt="decrease" />
                                                                                                            </span>
                                                                                                            <input
                                                                                                                type="tel"
                                                                                                                className="qty-input"
                                                                                                                readOnly
                                                                                                                value={item.quantity}
                                                                                                            />
                                                                                                            <span className="qty-increase" onClick={() => handleUpdateItem(item, item.quantity + 1)}>
                                                                                                                <img src={`${API_URL}/images/increase.png`} alt="increase" />
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <span className="intended__final-prices">{currency(item.quantity * item.price)}</span>
                                                                                                </div>
                                                                                                <div className="col-5">
                                                                                                    <span className="intended__delete" onClick={() => handleDeleteItem(item.product_id)}>
                                                                                                        <img src={`${API_URL}/images/trash.png`} alt="deleted" />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col l-3 m-3 c-12">
                                                        <div className="cart-total">
                                                            <div className="cart-total-prices">
                                                                <div className="cart-total-prices__inner">
                                                                    <div className="etSUOP">
                                                                        <div className="prices">
                                                                            <ul className="prices__items">
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">T???m t??nh</span>
                                                                                    <span className="prices__value">{currency(cart?.total_price)}</span>
                                                                                </li>
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">Gi???m gi??</span>
                                                                                    <span className="prices__value">0??</span>
                                                                                </li>
                                                                            </ul>
                                                                            <p className="prices__total">
                                                                                <span className="prices__text">T???ng c???ng</span>
                                                                                <span className="prices__value prices__value--final">{currency(cart?.total_price)}
                                                                                    <i>(???? bao g???m VAT n???u c??)</i>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="group-button">
                                                                        <Link to="#" onClick={checkQuantity} className="btn btn-add-to-cart">Mua H??ng</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="no-cart">
                                                    <img src={`${API_URL}/images/no-cart.png`} alt="" className="no-cart__img" />
                                                    <p className="no-cart__note">Kh??ng c?? s???n ph???m n??o trong gi??? h??ng c???a b???n.</p>
                                                    <Link to="/" className="no-cart__btn">Ti???p t???c mua s???m</Link>
                                                </div>
                                            )
                                        }
                                    </>

                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartPage;