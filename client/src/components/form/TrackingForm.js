import { Button, Dialog, Grid, IconButton, makeStyles } from '@material-ui/core';
import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TrackingOrder from 'components/Tracking/TrackingOrder';
import { currency } from 'utils/FormatCurrency';
// import { trackingStatusOrderGHN } from 'actions/services/GHNServices'
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 600,
        overflow: 'hidden',
        maxHeight: '100vh',
    },
    input: {
        display: 'none',
    },
    button: {
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: '1.3rem',
        marginRight: 5
    },
    textInput: {
        fontSize: '1.3rem',
        overflow: 'hidden'
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
    },
    padding: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 20,
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
    }
}))

const TrackingForm = (props) => {
    const classes = useStyles();
    const { onClose, open, orderInfo, orderDetails, orderId } = props;

    const handleCloseForm = () => {
        onClose();
    }

    return (
        <>
            {
                <Dialog onClose={handleCloseForm} open={open} className={classes.formControl}>
                    {
                        <IconButton aria-label="delete" onClick={handleCloseForm} className="close-icon">
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    }
                    <Grid className={classes.padding} container spacing={2}>
                        <Grid item sm={12} xs={12}>
                            <h3 className={classes.title}>
                                Theo dõi đơn hàng
                            </h3>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <p>
                                Mã đơn hàng: <span>{orderId}</span>
                            </p>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <p>
                                Tình trạng đơn hàng: <span>{orderInfo?.status_order_name}</span>
                            </p>
                        </Grid>
                        {
                            orderInfo?.status_order >= 2 ? (
                                <Grid item sm={12} xs={12}>
                                    <p>
                                        Mã vận đơn: <span>{orderInfo?.ship_order_code}</span>
                                    </p>
                                </Grid>
                            ) : ''
                        }
                        <Grid item sm={12}>
                            <div className="Nbknf">
                                <TrackingOrder order={orderInfo} />
                            </div>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <h3 className={classes.title}>
                                Đơn hàng bao gồm
                            </h3>
                        </Grid>

                        <Grid item sm={12} xs={12}>
                            <table id="orders">
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                </tr>
                                {
                                    orderDetails.map((item, index) => {
                                        return (
                                            <tr>
                                                <th>{item?.product_name}</th>
                                                <th>{item.amount_item}</th>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <th><span>Tổng cộng</span></th>
                                    <th><span className="sum">{currency(orderInfo.total_price + orderInfo?.ship_fee)}</span></th>
                                </tr>
                            </table>
                        </Grid>

                        <Grid container justify="flex-end">
                            <Button
                                onClick={handleCloseForm}
                                variant="outlined"
                                // fullWidth
                                className={classes.button}
                            >Trở lại</Button>
                        </Grid>
                    </Grid>
                </Dialog>
            }
        </>
    )
}
export default TrackingForm;