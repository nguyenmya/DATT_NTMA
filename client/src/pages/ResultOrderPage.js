import React, { useEffect, useState } from 'react'
import { updateStatusPayment, checkTradingCode, getDetailOrderByIdAfterPayment, updateStatusSendMail } from 'actions/services/OrderActions'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { sendMail } from 'actions/services/SendMailService';
import { getStatusByAppTransIDZaloPay, transactionStatusMomo } from 'actions/services/PaymentActions';
import Loading from 'components/Loading/Loading';
import { currency } from 'utils/FormatCurrency';

function ResultOrderPage(props) {

    const [loading, setLoading] = useState(true);
    const [orderDetail, setOrderDetail] = useState({});

    const params = new URLSearchParams(window.location.search)
    const order_id = params.get('order_id') ? params.get('order_id') : localStorage.getItem('order_id');

    // vnpay
    const vnp_BankCode = params.get('vnp_BankCode') ? params.get('vnp_BankCode') : null;
    const vnp_ResponseCode = params.get('vnp_ResponseCode') ? params.get('vnp_ResponseCode') : null;
    const vnp_TransactionNo = params.get('vnp_TransactionNo') ? params.get('vnp_TransactionNo') : null;

    // zalopay
    const status = params.get('status') ? params.get('status') : null;
    const bankcode = params.get('bankcode') ? params.get('bankcode') : null;
    const apptransid = params.get('apptransid') ? params.get('apptransid') : null;

    // momo
    const orderId = params.get('orderId') ? params.get('orderId') : null;
    const requestId = params.get('requestId') ? params.get('requestId') : null;
    const payType = params.get('payType') ? params.get('payType') : null;
    const errorCode = params.get('errorCode') ? params.get('errorCode') : null;
    const transId = params.get('transId') ? params.get('transId') : null;

    const handleUpdatePayment = () => {
        if (vnp_ResponseCode === "00") {
            const data = {
                order_id: parseInt(order_id),
                bankName: vnp_BankCode,
                tradingCode: vnp_TransactionNo
            }
            checkTradingCode(vnp_TransactionNo)
                .then(res => {
                    if (res.data === false) {
                        return updateStatusPayment(data)
                    } else {
                        toast.warning('Thanh to??n ????n h??ng kh??ng th??nh c??ng', {
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
                })
                .then((res) => {
                    setLoading(false);
                    props.history.push(`/success/payment?order_id=${order_id}`);
                    localStorage.removeItem('order_id');
                    toast.success(res.message, {
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
                .catch(err => console.log(err));
        }
        if (status === "1" || status === 1) {
            const data = {
                order_id: parseInt(order_id),
                bankName: bankcode,
                tradingCode: apptransid
            }
            getStatusByAppTransIDZaloPay(apptransid)
                .then(res => {
                    if (res.data.returncode === 1 && res.data.isprocessing === false) {
                        return checkTradingCode(apptransid);
                    } else {
                        toast.error(res.data.returnmessage, {
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
                })
                .then(result => {
                    if (result.data === false) {
                        return updateStatusPayment(data);
                    } else {
                        return;
                    }
                })
                .then(result => {
                    setLoading(false);
                    if (result) {
                        props.history.push(`/success/payment?order_id=${order_id}`);
                        localStorage.removeItem('order_id');
                        toast.success(result.message, {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    } else {
                        return;
                    }
                })
                .catch(err => console.log(err));
        }
        if (errorCode === "0" || errorCode === 0) {
            const data = {
                order_id: parseInt(order_id),
                bankName: payType,
                tradingCode: transId
            }
            transactionStatusMomo({ orderId: orderId, requestId: requestId })
                .then(res => {
                    if (res.data.errorCode === 0 || res.data.errorCode === "0") {
                        return checkTradingCode(transId);
                    } else {
                        toast.error(res.localMessage, {
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
                })
                .then(result => {
                    if (result.data === false) {
                        return updateStatusPayment(data);
                    } else {
                        return;
                    }
                })
                .then(result => {
                    setLoading(false);
                    if (result) {
                        props.history.push(`/success/payment?order_id=${order_id}`);
                        localStorage.removeItem('order_id');
                        toast.success(result.message, {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    } else {
                        return;
                    }
                })
                .catch(err => console.log(err));
        }
    }

    useEffect(() => {

        document.title = "K???t qu??? thanh to??n | Tiki";
        if ((vnp_TransactionNo === null && apptransid) || (vnp_TransactionNo && apptransid === null) || errorCode !== null) {
            handleUpdatePayment();
        }
        if (order_id) {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getDetailOrderByIdAfterPayment(order_id)
            .then(res => {
                setOrderDetail(res);
                if (res.send_status === 0) {
                    const data = {
                        to: res.email,
                        from: "huonghuongnewton@gmail.com",
                        subject: `X??c nh???n ????n h??ng #${res.id}`,
                        id: res.id,
                        order: res
                    }
                    return sendMail(data)
                } else {
                    return;
                }
            })
            .then(result => {
                if (result.data.message) {
                    return updateStatusSendMail(result.data.message)
                } else {
                    return;
                }
            })
            .catch(err => console.log(err))
    }, [order_id])



    return (
        <>
            <div className="row sm-gutter section__content">
                {
                    loading ? <Loading /> : (
                        <>
                            {
                                orderDetail && orderDetail?.status_order === -1 ? (
                                    <div className="col l-12 m-12 c-12">
                                        <div className="order-info">
                                            <div className="failure-info">
                                                <div className="failure-info__image">
                                                    <img src="https://salt.tikicdn.com/ts/upload/5a/f7/f7/4ce925ffff6449700efdc46a98112f88.jpg" alt="img" />
                                                </div>
                                                <div className="failure-info__content">
                                                    <h2 className="title">Thanh to??n kh??ng th??nh c??ng</h2>
                                                    <div className="error-block">
                                                        <span className="error-block__generic"></span>
                                                        <span className="error-block__spec" />
                                                    </div>
                                                    <div className="order-info-fail">
                                                        <div className="order-info__left">M?? ????n h??ng</div>
                                                        <div className="order-info__right">{order_id}</div>
                                                    </div>
                                                    <div className="order-info-fail">
                                                        <div className="order-info__left">Ph????ng th???c thanh to??n</div>
                                                        <div className="order-info__right">{orderDetail.status_payment_name}</div>
                                                    </div>
                                                    <div className="order-info-fail" style={{ boxShadow: 'none' }}>
                                                        <div className="order-info__left">T???ng ti???n</div>
                                                        <div className="order-info__right">{currency(orderDetail.total_price + orderDetail.ship_fee)}</div>
                                                    </div>
                                                    <div className="button-block">
                                                        <a href="/" className="left-button">Ti???p t???c mua s???m</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col l-12 m-12 c-12">
                                        <div className="order-info">
                                            <div className="order-info__left">
                                            </div>
                                            <div className="order-info__content">
                                                <h3 className="thanks-msg">C???m ??n b???n ???? mua h??ng </h3>
                                                <p>M?? s??? ????n h??ng c???a b???n:</p>
                                                <div className="order-number">{orderDetail.id}</div>
                                                <p>B???n c?? th??? xem l???i <Link to="/customer/order/history">????n h??ng c???a t??i</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </>
    )
}

export default ResultOrderPage;