import { Grid } from "@material-ui/core";
import CardComponent from "components/card/CardComponent";
// import StatusCard from "components/status-card/StatusCard";
import React, { useCallback, useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getQuantityOrderByStatus,
    getQuantityProductByType,
    reportProductTop5MostSold,
    reportCustomerTop5MostBuy
} from "services/ReportServices";
import { currency } from "utils/formatCurrency";

// const chartOptions = {
//     series: [
//         {
//             name: "Online Customers",
//             data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
//         },
//         {
//             name: "Store Customers",
//             data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10],
//         },
//     ],
//     options: {
//         color: ["#6ab04c", "#2980b9"],
//         chart: {
//             background: "transparent",
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         stroke: {
//             curve: "smooth",
//         },
//         xaxis: {
//             categories: [
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//                 "Sep",
//             ],
//         },
//         legend: {
//             position: "top",
//         },
//         grid: {
//             show: false,
//         },
//     },
// };
// const statusCards = [
//     {
//         icon: "bx bx-shopping-bag",
//         count: "1,995",
//         title: "Total sales",
//     },
//     {
//         icon: "bx bx-cart",
//         count: "2,001",
//         title: "Daily visits",
//     },
//     {
//         icon: "bx bx-dollar-circle",
//         count: "$2,632",
//         title: "Total income",
//     },
//     {
//         icon: "bx bx-receipt",
//         count: "1,711",
//         title: "Total orders",
//     },
// ];

const topProductHead = [
    'S???n ph???m',
    'Danh m???c',
    '???? b??n',
    'T???ng ti???n'
]

const topCustomerHead = [
    'Kh??ch h??ng',
    'S??? ??i???n tho???i',
    '???? mua',
    'T???ng ti???n'
]

const renderProductHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderProductBody = (item, index) => (
    <tr key={index}>
        <td>{item.product_name}</td>
        <td>{item.product_category}</td>
        <td>{item.quantity_sold}</td>
        <td>{currency(item.total_price)}</td>
    </tr>
)

const renderCusomerHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderCusomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.customer_name}</td>
        <td>{item.customer_phone}</td>
        <td>{item.quantity_buy}</td>
        <td>{currency(item.total_price)}</td>
    </tr>
)

export default function Dashboard() {
    useEffect(() => {
        document.title = "Admin | Dashboard";
    }, []);

    // const themeReducer = useSelector((state) => state.ThemeReducer.mode);
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [mostSold, setMostSold] = useState([]);
    const [mostBuy, setMostBuy] = useState([]);
    const getDataOrder = useCallback(() => {
        getQuantityOrderByStatus({last_date: 0})
            .then(res => setOrders(res.data))
            .catch(err => console.log(err))
    }, [])

    const getDataProduct = useCallback(() => {
        getQuantityProductByType()
            .then(res => setProducts(res.data))
            .catch(err => console.log(err))
    }, [])

    const getMostProduct = useCallback(() => {
        reportProductTop5MostSold()
            .then(res => {
                setMostSold(res.data.content);
            })
            .catch(err => console.log(err))
    }, [])

    const getMostBuy = useCallback(() => {
        reportCustomerTop5MostBuy()
            .then(res => {
                setMostBuy(res.data.content);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        getDataOrder();
        getDataProduct();
    }, [getDataOrder, getDataProduct]);

    useEffect(() => {
        getMostProduct();
        getMostBuy();
    }, [getMostProduct, getMostBuy]);

    return (
        <div>
            {/* <h2 className="page-header">Dashboard</h2> */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Grid container spacing={3}>
                                <Grid item md={6}>
                                    <CardComponent
                                        title="T???ng ????n h??ng"
                                        subtitle="30 ng??y g???n nh???t"
                                        icon="bx bx-shopping-bag"
                                        data={orders}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <CardComponent
                                        title="S???n ph???m ??ang b??n"
                                        subtitle="S???n ph???m"
                                        icon="bx bx-cart"
                                        data={products}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <div className="card">
                                        <div className="card__header">
                                            <h3>top s???n ph???m b??n ch???y</h3>
                                        </div>
                                        <div className="card__body">
                                            <div className="table-wrapper">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            {topProductHead.map((item, index) => renderProductHead(item, index))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {mostSold.map((item, index) => renderProductBody(item, index))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card__footer">
                                            <Link to='/admin/report/product'>Xem t???t c???</Link>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item md={6}>
                                    <div className="card">
                                        <div className="card__header">
                                            <h3>top kh??ch h??ng mua nhi???u</h3>
                                        </div>
                                        <div className="card__body">
                                            <div className="table-wrapper">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            {topCustomerHead.map((item, index) => renderCusomerHead(item, index))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {mostBuy.map((item, index) => renderCusomerBody(item, index))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card__footer">
                                            <Link to='/admin/report/customer'>Xem t???t c???</Link>
                                        </div>
                                    </div>
                                </Grid>
                                {/* <Grid item md={6}>
                                    <div className="row">
                                        {statusCards.map((item, index) => (
                                            <div className="col-6" key={index}>
                                                <StatusCard
                                                    icon={item.icon}
                                                    count={item.count}
                                                    title={item.title}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Grid> */}
                                {/* <Grid item md={6}>
                                    <Chart
                                        options={
                                            themeReducer === "theme-mode-dark"
                                                ? {
                                                    ...chartOptions.options,
                                                    theme: { mode: "dark" },
                                                }
                                                : {
                                                    ...chartOptions.options,
                                                    theme: { mode: "light" },
                                                }
                                        }
                                        series={chartOptions.series}
                                        type="line"
                                        height="100%"
                                    />
                                </Grid> */}
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
