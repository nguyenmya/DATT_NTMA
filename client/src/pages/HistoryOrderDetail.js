import {
    Button,
    Grid,
    makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
    getDetailOrderById,
    cancelOrder
} from "actions/services/OrderActions";
import { currency } from "utils/FormatCurrency";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountNavbar from "components/AccountNavbar/AccountNavbar.";
import { Link } from "react-router-dom";
import useTimeout from "hooks/useTimeout";
import Loading from "components/Loading/Loading";
import { getUserLogin } from "actions/services/UserActions";
// import { calculateShipTime } from 'actions/services/GHNServices'
import CustomerReviewForm from "components/form/CustomerReviewForm";
// import TrackingOrder from "components/Tracking/TrackingOrder";
import TrackingForm from "components/form/TrackingForm";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});


const useStyles = makeStyles({
    container: {
        maxHeight: 440,
    },
    visuallyHidden: {
        display: "none",
    },
    text: {
        fontSize: "1.3rem",
    },
    head: {
        fontSize: "1.5rem",
        background: "#156D90",
        color: "#fff",
    },
    caption: {
        color: "inherit",
        padding: 8,
        fontSize: "1.3rem",
    },
    toolbar: {
        "& > p:nth-of-type(2)": {
            fontSize: "1.3rem",
            fontWeight: 500,
        },
    },
    formControl: {
        minWidth: 120,
        marginRight: 15,
    },
    button: {
        padding: "12px 24px",
        fontWeight: 600,
        fontSize: "1.3rem",
    },
    right: {
        textAlign: 'right'
    },
});

function HistoryOrderDetail(props) {
    const classes = useStyles();

    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [orderInfo, setOrderInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [openTracking, setOpenTracking] = useState(false);
    const [product, setProduct] = useState({});
    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
    })
    const [openForm, setOpenForm] = useState(false);

    const handleClickOpenForm = (item) => {
        setOpenForm(true);
        setProduct(item);
    };


    const handleClickOpenTracking = () => {
        setOpenTracking(true);
    };

    const handleCloseTracking = () => {
        getUser();
        setOpenTracking(false);
    }

    const handleCloseForm = () => {
        setOpenForm(false);
        getUser();
    }

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const id = props.match.params.id;
        cancelOrder(id)
            .then((res) => {
                toast.success(res.message);
                getData();
            })
            .catch((err) => {
                console.log(err);
                toast.warning(err)
            });
    };

    const getData = () => {
        const id = props.match.params.id;
        getDetailOrderById(id)
            .then((res) => {
                setOrders(res.order_details);
                setUserInfo(res.user);
                setOrderInfo(res.order_info);
            })
            .catch((err) => console.log(err));
    };
    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        document.title = "????n h??ng c???a t??i | fivver"
        getUser();
        getData();
        // if (orderInfo?.ship_type === 1) {
        //     calculateShipTime({
        //         from_district_id: 1542,
        //         from_ward_code: "1B1507",
        //         to_district_id: orderInfo?.district_id,
        //         to_ward_code: orderInfo?.ward_code,
        //         service_id: 53320
        //     })
        //         .then((res) => setShipTime(res.data.data))
        //         .catch(err => console.log(err))
        // } else {
        //     setShipTime('');
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderInfo?.ship_type, props.match.params.id]);

    useTimeout(() => setLoading(false), loading ? 500 : null);

    // t??nh t???ng ti???n trong ds s???n ph???m ??? ????n h??ng chi ti???t
    const calTotalItemPrice = (orders) => {
        let total = 0;
        orders.forEach((item) => {
            total += item.total_price;
        })
        return total;
    }

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter">
                            <div className="col l-2-4 m-2 c-2">
                                <AccountNavbar name={user?.fullName}></AccountNavbar>
                            </div>
                            <div className="col l-9-4 m-10 c-10">
                                <div className="glOjBk list-cusomer-order">
                                    {
                                        loading ? <Loading /> : (
                                            <>
                                                <div className="heading"> Chi ti???t ????n h??ng #{props.match.params.id} - <span>{orderInfo.status_order_name}</span></div>
                                                <Grid container spacing={3}>
                                                    <Grid item sm={12}>
                                                        <div className="cRRvpz">
                                                            <div className="gQjSfs">
                                                                <div className="title">?????a ch??? ng?????i nh???n</div>
                                                                <div className="content">
                                                                    <p className="name">{userInfo.user_fullname}</p>
                                                                    <p className="address">
                                                                        <span>?????a ch???: </span>{orderInfo.address + ',' + orderInfo.ward + ', ' + orderInfo.district + ', ' + orderInfo.province}
                                                                    </p>
                                                                    <p className="phone"><span>??i???n tho???i: </span>{userInfo.phone}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="gQjSfs">
                                                                <div className="title">H??nh th???c giao h??ng</div>
                                                                <div className="content">
                                                                    <p>Th???i gian giao d??? t??nh: {orderInfo?.expectedDate}</p>
                                                                    <p>???????c giao b???i: {orderInfo?.ship_type === 2 ? 'Giao H??ng Ti???t Ki???m' : 'Giao H??ng Nhanh'}</p>
                                                                    {
                                                                        orderInfo?.ship_order_code && orderInfo?.ship_order_code !== null ? (
                                                                            <p>M?? v???n ????n: {orderInfo?.ship_order_code}</p>
                                                                        ) : ''
                                                                    }
                                                                    <p>Ph?? v???n chuy???n: {currency(orderInfo?.ship_fee)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="gQjSfs">
                                                                <div className="title">H??nh th???c thanh to??n</div>
                                                                <div className="content">
                                                                    <p className="">{orderInfo?.payment_method}</p>
                                                                    <p className="">{orderInfo.status_payment_name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    {/* <Grid item sm={12}>
                                                        <div className="Nbknf">
                                                            <TrackingOrder order={orderInfo} openTracking={openTracking} handleOpenTracking={handleClickOpenTracking} />
                                                        </div>
                                                    </Grid> */}
                                                    <Grid item sm={12}>
                                                        <div className="Nbknf">
                                                            <div style={{ padding: '15px 20px 15px 0', float: 'right' }}>
                                                                <p><span className="btn-tracking" onClick={handleClickOpenTracking}>Theo d??i ????n h??ng</span></p>
                                                            </div>
                                                        </div>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <table className="Nbknf">
                                                            <thead>
                                                                <tr>
                                                                    <th>S???n ph???m</th>
                                                                    <th>Lo???i s???n ph???m</th>
                                                                    <th>Gi??</th>
                                                                    <th>S??? l?????ng</th>
                                                                    <th>T???m t??nh</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    orders?.map((item, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    <div className="product-item">
                                                                                        <img src={item?.mainImage} alt="S???n ph???m" />
                                                                                        <div className="product-info">
                                                                                            <Link className="product-name" to={`/san-pham/${item?.product_id}/${item?.product_slug}`}>{item?.product_name}</Link>
                                                                                            <p className="product-sku">SKU: {item?.product_id}</p>
                                                                                            {
                                                                                                orderInfo?.status_order === 3 ? (
                                                                                                    <div className="product-review">
                                                                                                        <span onClick={() => handleClickOpenForm(item)}>Vi???t nh???n x??t</span>
                                                                                                        <Link to={`/san-pham/${item?.product_id}/${item?.product_slug}`} target="_blank">Mua l???i</Link>
                                                                                                    </div>
                                                                                                ) : ""
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="discount-amount">{item?.category}</td>
                                                                                <td className="price">{currency(item.price_item)}</td>
                                                                                <td className="quantity">{item.amount_item}</td>
                                                                                <td className="raw-total">{currency(item.total_price)}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <span>T???m t??nh</span>
                                                                    </td>
                                                                    <td>{currency(calTotalItemPrice(orders))}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}><span>Ph?? v???n chuy???n</span></td>
                                                                    <td>{currency(orderInfo?.ship_fee)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}><span>T???ng c???ng</span></td>
                                                                    <td><span className="sum">{currency(orderInfo.total_price + orderInfo?.ship_fee)}</span></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </Grid>
                                                    <Grid item md={12} className={classes.right}>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            className={classes.button}
                                                            onClick={handleSubmitOrder}
                                                        >
                                                            Hu??? ????n h??ng
                                                        </Button>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Link className="view-list-order" to="/customer/order/history">&lt;&lt; Quay l???i ????n h??ng c???a t??i</Link>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerReviewForm open={openForm} onClose={handleCloseForm} product={product} user={user?.fullName} />
            {
                openTracking ? <TrackingForm open={openTracking} orderId={props.match.params.id} orderInfo={orderInfo} orderDetails={orders} orderUser={userInfo} onClose={handleCloseTracking} /> : ''
            }
        </>
    );
}

export default HistoryOrderDetail;
