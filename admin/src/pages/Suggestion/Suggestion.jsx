import { Button, Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import Loading from 'components/loading/Loading';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { getAllCategory } from 'services/CategoryServices';

const brands = [
    {
        category: 'laptop',
        brands: [
            
            {
                name: 'HP',
                code: 'hp'
            },
            {
                name: 'ASUS',
                code: 'asus'
            },
            {
                name: 'Macbook',
                code: 'macbook'
            },
            {
                name: 'DELL',
                code: 'dell'
            },
            {
                name: 'Acer',
                code: 'acer'
            },
        ]
    }
]

export default function Suggestion() {

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([])
    const [data, setData] = useState({
        category: '',
        brand: '',
        ram: '',
        memory: '',
        type_screen: ''
    })
    useEffect(() => {
        let searchObj = {};
        searchObj.limit = 100;
        searchObj.page = 0;
        searchObj.display = 1;
        getAllCategory(searchObj)
            .then(res => {
                setLoading(false);
                setCategories(res.data.content)
            }, [])
            .catch(err => console.log(err))
    }, [])

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeAutocomplete = (event, value) => {
        setData({
            ...data,
            category: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
    }
    return (
        <div>
            <h2 className="page-header">Dự đoán hàng bán chạy</h2>
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
                                            <Grid item sm={12} xs={12}>
                                                <ValidatorForm onSubmit={handleSubmit}>
                                                    <div className="card">
                                                        <div className="card__header">
                                                            <h3>Dự đoán nhập hàng theo thuộc tính sản phẩm</h3>
                                                        </div>
                                                        <div className="card__body">
                                                            <div className="input-text">
                                                                <Autocomplete
                                                                    id="tags-standard"
                                                                    options={categories.map(item => {
                                                                        return {
                                                                            name: item.name,
                                                                            code: item.code
                                                                        }
                                                                    })}
                                                                    filterSelectedOptions
                                                                    getOptionLabel={(option) => option.name ? option.name : ''}
                                                                    fullWidth
                                                                    onChange={handleChangeAutocomplete}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} name='category' label='Category' variant="outlined" />
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                <Autocomplete
                                                                    id="tags-standard"
                                                                    options={brands.map(item => {
                                                                        return item.category === 'laptop' ? item.brands.map(brand => {
                                                                            return {
                                                                                name: brand.name,
                                                                                code: brand.code
                                                                            }
                                                                        }) : []
                                                                    })}
                                                                    getOptionLabel={(option) => option.name ? option.name : ''}
                                                                    fullWidth
                                                                    onChange={(event, value) => {
                                                                        setData({
                                                                            ...data,
                                                                            brand: value,
                                                                        })
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} name='brand' label='Brand' variant="outlined" />
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="input-text">
                                                                {/* <TextValidator
                                                                    fullWidth
                                                                    type="text"
                                                                    name="ram"
                                                                    value={data?.ram}
                                                                    inputProps={{
                                                                        style: { color: 'blue' },
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    label={
                                                                        <span>
                                                                            <span style={{ color: "red" }}>*</span>
                                                                            Tên tài khoản
                                                                        </span>
                                                                    }
                                                                    validators={["required"]}
                                                                    errorMessages={["Trường này không được để trống"]}
                                                                /> */}
                                                            </div>
                                                            <div className="input-text">

                                                            </div>
                                                            <div className="input-text">

                                                            </div>

                                                            <div className="input-text">

                                                            </div>
                                                        </div>
                                                        <div className="card__footer">
                                                            <Grid item sm={12} xs={12}>
                                                                <Button
                                                                    variant="outlined" color="secondary"
                                                                    style={{ margin: '10px 0', width: '100%' }}
                                                                    className="btn btn--e-transparent-brand-b-2"
                                                                    type="submit"
                                                                >Submit</Button>
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
