import { Button, Grid } from '@material-ui/core'
import Loading from 'components/loading/Loading';
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserLogin, updateInfo, getShopInfo, updateShopInfo } from 'redux/actions/AuthActions';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

export default function ShopInfo() {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
        email: '',
        phone: '',
        dateOfBirth: ''
    });

    const [shopInfo, setShopInfo] = useState({
        id: '',
        shop_name: '',
        shop_address: '',
        shop_email: '',
        shop_phone: '',
        shop_description: ''
    })

    const getData = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }

    const getInfoShop = () => {
        getShopInfo()
            .then(res => setShopInfo(res.data))
            .catch(err => console.log(err))
    }

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleShopInfoChange = (e) => {
        setShopInfo({
            ...shopInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            username: user?.username,
            email: user?.email,
            fullName: user?.fullName,
            phone: user?.phone,
            dateOfBirth: user?.dateOfBirth
        }
        // console.log(data)
        updateInfo(data)
            .then((res) => {
                toast.success(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false);
                getData();
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getData();
            })
    }

    const handleShopInfoSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            id: shopInfo?.id,
            shop_name: shopInfo?.shop_name,
            shop_email: shopInfo?.shop_email,
            shop_phone: shopInfo?.shop_phone,
            shop_address: shopInfo?.shop_address,
            shop_description: shopInfo?.shop_description,
        }
        updateShopInfo(data)
            .then((res) => {
                toast.success(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false);
                getInfoShop();
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getInfoShop();  
            })
    }

    useEffect(() => {
        getData();
        getInfoShop();
    }, [])

    return (
        <div>
            <h2 className="page-header">Qu???n l?? th??ng tin shop</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    {loading ? (
                                        <Loading />
                                    ) : (
                                        <Grid className="" container spacing={2}>
                                            <Grid item sm={6} xs={6}>
                                                <ValidatorForm onSubmit={handleSubmit}>
                                                    <div className="card">
                                                        <div className="card__header">
                                                            <h3>T??i kho???n ????ng nh???p</h3>
                                                        </div>
                                                        <div className="card__body">
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="username"
                                                                    value={user?.username}
                                                                    disabled
                                                                    inputProps={{
                                                                        style: { color: 'blue' },
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            T??n t??i kho???n
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="email"
                                                                    value={user?.email}
                                                                    onChange={handleInputChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            Email
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="fullName"
                                                                    value={user?.fullName}
                                                                    onChange={handleInputChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            H??? v?? t??n
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="number"
                                                                    name="phone"
                                                                    value={user?.phone}
                                                                    onChange={handleInputChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            S??? ??i???n tho???i
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>

                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    style={{ margin: '5px 0' }}
                                                                    type="date"
                                                                    name="dateOfBirth"
                                                                    value={user?.dateOfBirth}
                                                                    onChange={handleInputChange}
                                                                    placeholder=""
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            Ng??y sinh
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Ng??y sinh kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="card__footer">
                                                            <Grid item sm={12} xs={12}>
                                                                <Button
                                                                    variant="outlined" color="secondary"
                                                                    style={{ margin: '10px 0', width: '100%' }}
                                                                    className="btn btn--e-transparent-brand-b-2"
                                                                    type="submit"
                                                                >C???p nh???t th??ng tin</Button>
                                                            </Grid>
                                                        </div>
                                                    </div>
                                                </ValidatorForm>
                                            </Grid>

                                            <Grid item sm={6} xs={6}>
                                                <ValidatorForm onSubmit={handleShopInfoSubmit}>
                                                    <div className="card">
                                                        <div className="card__header">
                                                            <h3>Th??ng tin c???a h??ng v?? qu???n l??</h3>
                                                        </div>
                                                        <div className="card__body">
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="shop_name"
                                                                    value={shopInfo?.shop_name}
                                                                    inputProps={{
                                                                        style: { color: 'blue' },
                                                                    }}
                                                                    onChange={handleShopInfoChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            T??n c???a h??ng
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="fullName"
                                                                    disabled
                                                                    value={user?.fullName}
                                                                    onChange={handleShopInfoChange}
                                                                    inputProps={{
                                                                        style: { color: 'blue' },
                                                                    }}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            Ng?????i qu???n l??
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="shop_address"
                                                                    value={shopInfo?.shop_address}
                                                                    onChange={handleShopInfoChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            ?????a ch???
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="shop_phone"
                                                                    value={shopInfo?.shop_phone}
                                                                    onChange={handleShopInfoChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            S??? ??i???n tho???i
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="shop_description"
                                                                    value={shopInfo?.shop_description}
                                                                    onChange={handleShopInfoChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            M?? t???
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Tr?????ng n??y kh??ng ???????c ????? tr???ng"]}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="card__footer">
                                                            <Grid item sm={12} xs={12}>
                                                                <Button
                                                                    variant="outlined" color="secondary"
                                                                    style={{ margin: '10px 0', width: '100%' }}
                                                                    className="btn btn--e-transparent-brand-b-2"
                                                                    type="submit"
                                                                >C???p nh???t th??ng tin</Button>
                                                            </Grid>
                                                        </div>
                                                    </div>
                                                </ValidatorForm>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
