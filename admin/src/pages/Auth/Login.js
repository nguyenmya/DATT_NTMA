import React, { useState } from 'react'
import { Button, Grid, makeStyles } from '@material-ui/core';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from 'redux/actions/AuthActions';
import { useEffect } from 'react';
import './style.css'

const useStyles = makeStyles({
    text: {
        fontSize: '1.3rem'
    }
})

function Login(props) {

    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {

        document.title = "Đăng nhập | Tiki"
        let isAuth = localStorage.getItem('token')
        if (isAuth && isAuth !== 'undefined') {
            history.push('/admin/dashboard');
        }
    }, [history])

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            username,
            password
        }
        dispatch(login(data, history));
    }
    return (
        <div className="container">
            <div className="row sm-gutter section__content">
                <div className="col col-12 col-md-12 col-xs-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">

                            <div className="">
                                <ValidatorForm onSubmit={handleSubmit}>
                                    <Grid className="" container spacing={2}>
                                        <Grid item sm={12} xs={12}>
                                            <TextValidator
                                                className={classes.text}
                                                fullWidth
                                                type="text"
                                                name="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                label={
                                                    <span>
                                                        <span style={{ color: "red" }}>*</span>
                                                        Tên tài khoản
                                                    </span>
                                                }
                                                validators={["required"]}
                                                errorMessages={["Trường này không được để trống"]}
                                            />
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <TextValidator
                                                className={classes.text}
                                                fullWidth
                                                type="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                label={
                                                    <span>
                                                        <span style={{ color: "red" }}>*</span>
                                                        Mật khẩu
                                                    </span>
                                                }
                                                validators={["required"]}
                                                errorMessages={["Trường này không được để trống"]}
                                            />
                                        </Grid>

                                        <Grid item sm={12} xs={12}>
                                            <Button
                                                variant="outlined" color="secondary"
                                                style={{ margin: '10px 0', width: '100%' }}
                                                className="btn btn--e-transparent-brand-b-2"
                                                type="submit"
                                                onClick={handleSubmit}
                                            >Đăng nhập</Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;