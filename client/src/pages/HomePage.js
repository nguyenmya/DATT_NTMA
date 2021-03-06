import React, { useCallback, useEffect, useState } from 'react'
import Slide from 'components/Slide/Slide'
import Promotion from 'components/Promotion/Promotion'
import Category from 'components/CategoryHighlights/Category'
import * as services from 'actions/services/ProductServices'
import useTimeout from 'hooks/useTimeout'
import ProductItem from 'components/Item/ProductItem'
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton'
import ProductTopSale from 'components/Item/ProductTopSale'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from 'actions/services/UserActions'
import { getListRecommendForUser } from 'actions/services/RecommendServices'
import Carousel from 'Carousel/Carousel'

const brands = [
    {
        link: '/thuong-hieu/iphone',
        image: 'http://localhost:8080/images/logo/logo-iphone.jpg'
    },
    {
        link: '/thuong-hieu/samsung',
        image: 'http://localhost:8080/images/logo/samsung.png'
    },
    {
        link: '/thuong-hieu/xiaomi',
        image: 'http://localhost:8080/images/logo/xiaomi.jpg'
    },
    {
        link: '/thuong-hieu/vivo',
        image: 'http://localhost:8080/images/logo/vivo.png'
    },
    {
        link: '/thuong-hieu/oppo',
        image: 'http://localhost:8080/images/logo/oppo.jpg'
    },
    {
        link: '/thuong-hieu/Casper',
        image: 'http://localhost:8080/images/logo/casper.png'
    },
    {
        link: '/thuong-hieu/Logitech',
        image: 'http://localhost:8080/images/logo/logitech.jpg'
    },
    {
        link: '/thuong-hieu/DELL',
        image: 'http://localhost:8080/images/logo/dell.jpg'
    },
    {
        link: '/thuong-hieu/apple',
        image: 'http://localhost:8080/images/logo/Apple-Logo.jpg'
    },
    {
        link: '/thuong-hieu/ASUS',
        image: 'http://localhost:8080/images/logo/asus.png'
    },
    {
        link: '/thuong-hieu/Xmobile',
        image: 'http://localhost:8080/images/logo/xmobile.png'
    },
    {
        link: '/thuong-hieu/Rapoo',
        image: 'http://localhost:8080/images/logo/rapoo.jpg'
    }
]

function HomePage(props) {
    const [products, setProducts] = useState([]);
    const [topSale, setTopSale] = useState([]);
    const [mostPopularProduct, setMostPopularProduct] = useState([]);
    const [recommendList, setRecommendList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const getUser = useCallback(() => {
        dispatch(getCurrentUser())
    }, [dispatch])



    const handleChangePage = (page) => {
        setPage(page + 1)
    }

    const getNewData = useCallback(() => {
        let searchObject = {
            page: page,
            limit: 24,
            keyword: ''
        }
        services.getProductList(searchObject)
            .then((res) => {
                setProducts([...products, ...res.data.content]);
                setLoading(false);
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const getTopSaleProduct = () => {
        services.topSaleProduct()
            .then(res => {
                setTopSale(res.data.content);
            })
            .catch(err => console.log(err))
    }

    const getPopularProduct = useCallback(() => {
        services.getListProductMostPopular()
            .then(res => setMostPopularProduct(res.data))
            .catch(() => setMostPopularProduct([]))
    }, [])

    useEffect(() => {
        document.title = "Mua h??ng online gi?? t???t, h??ng chu???n, ship nhanh"
        getNewData();
        getTopSaleProduct();
        getPopularProduct();
    }, [getNewData, getPopularProduct])

    useEffect(() => {
        getUser();
    }, [getUser])

    useEffect(() => {
        if (user) {
            getListRecommendForUser()
                .then((res) => {
                    setRecommendList(res)
                })
                .catch(() => setRecommendList([]))
        }
    }, [user])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="">
                {/* <div className="grid wide">
                    <div className="row">
                        <div className="col l-12 m-12 c-12">
                            <div className="content">
                                <div className="nav">
                                    <div className="slider-bar">
                                        <span className="products">
                                            <Link to="/" className="list">
                                                <div className="product">Thi???t b??? s???</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">??i???n tho???i</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">M??y t??nh b???ng</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Laptop</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">??i???n t???</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">M??y ???nh</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Smartphone</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Ph??? ki???n Laptop</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Ph??? ki???n ??i???n tho???i</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">M??y gi???t Inverter</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Smart TV</div>
                                            </Link>
                                            <Link to="/" className="list">
                                                <div className="product">Inverter TV</div>
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="slider_content">
            {/* <Slide /> */}
            <Carousel/>

            </div>
            <Promotion />

            {/* <div className="row sm-gutter section__content" >
                <div className="col l-12 m-12 c-12" style={{backgroundColor: "#FFD400"}}>
                <img src="https://daipro.xyz/wp-content/uploads/2022/04/Sansale-desk-1-1200x90-1.png" alt="" className="trends__img" style={{width: "100%", height: ""}} />

                    <div className="home-product"style={{backgroundColor: "#FFD400"}}>
                        <div className="row sm-gutter section__item" style={{backgroundColor: "#FFD400"}}>
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Xu H?????ng Mua S???m
                                    </h3>
                                </div>
                            </div>
                            <div className="col l-12 m-12 c-12">
                                <div className="trend-list">
                                    <Link to="/dien-thoai" className="trends__item-container">
                                        <div className="trends__box">
                                            <div className="title">??i???n tho???i Smartphone</div>
                                            <div className="sub-title">Gi???m ?????n 25%</div>
                                            <div className="trends__img-box">
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/w100/ts/product/48/22/7c/0ddf107a81ccf15f9e2d27ba67e25d6b.jpg.webp" alt="" className="trends__img" />
                                                </picture>
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/w100/ts/product/ac/e0/57/6f377a45a456cda76c40bbd79b64a0a3.png.webp" alt="" className="trends__img" />
                                                </picture>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="/laptop" className="trends__item-container">
                                        <div className="trends__box">
                                            <div className="title">Laptop</div>
                                            <div className="sub-title">Gi???m ?????n 29%</div>
                                            <div className="trends__img-box">
                                                <picture className="trends__img-container">
                                                    <img src="https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633964583279_hpprobook-1.jpg?alt=media&token=2e863728-f0af-420e-92d7-c198ebe810ab" alt="" className="trends__img" />
                                                </picture>
                                                <picture className="trends__img-container">
                                                    <img src="https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633964870944_hp-gaming-1.png?alt=media&token=faa23b81-07db-440f-8988-aa6f4c8207f6" alt="" className="trends__img" />
                                                </picture>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="/tivi/smart-tivi" className="trends__item-container">
                                        <div className="trends__box">
                                            <div className="title">Smart TV</div>
                                            <div className="sub-title">Gi???m ?????n 15%</div>
                                            <div className="trends__img-box">
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/200x200/media/catalog/producttmp/01/de/fd/0c4c0ba101d2e003f9d150827a50b85a.jpg.webp" alt="" className="trends__img" />
                                                </picture>
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/200x200/ts/product/3d/e0/b3/6ad732324e4f786bd19d234cb232fbfa.jpg.webp" alt="" className="trends__img" />
                                                </picture>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="/thiet-bi-phu-kien" className="trends__item-container">
                                        <div className="trends__box">
                                            <div className="title">Thi???t b??? ph??? ki???n</div>
                                            <div className="sub-title">Gi???m ?????n 20%</div>
                                            <div className="trends__img-box">
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/200x200/ts/product/58/84/f4/abc897dcc4dfc6a69f3c216cf9358c20.png.webp" alt="" className="trends__img" />
                                                </picture>
                                                <picture className="trends__img-container">
                                                    <img src="https://salt.tikicdn.com/cache/200x200/ts/product/87/5e/c4/e648b0853ff786c20ab61c9b7137921e.jpg.webp" alt="" className="trends__img" />
                                                </picture>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <Category />
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        Th????ng hi???u n???i b???t
                                    </h3>
                                </div>
                            </div>
                            {
                                brands.map((item, index) => {
                                    return (
                                        <div className="col l-2 m-2 c-6" key={index}>
                                            <Link to={item.link} title="Sony" className="img-branch d-block">
                                                <img loading="lazy" src={item.image} alt="" className="img-fluid" />
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row sm-gutter section__content">
                {/* <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        S???n ph???m b??n ch???y nh???t
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={products.length} /> : <ProductTopSale products={topSale} />
                            }
                        </div>
                    </div>
                </div> */}
                {/* <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        S???n ph???m ph??? bi???n nh???t
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={mostPopularProduct.length} /> : <ProductTopSale products={mostPopularProduct} />
                            }
                        </div>
                    </div>
                </div> */}
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product-category-item">
                                    <h3 className="home-product-title">
                                        S???n ph???m m???i nh???t
                                    </h3>
                                </div>
                            </div>
                            {
                                loading ? <ProductItemSkeleton total={products.length} /> : <ProductItem products={products} />
                            }
                            <div className="col l-12 m-12 c-12">
                                <div className="section-center">
                                    {
                                        page <= 3 ? <button className="home-product-viewmore" onClick={() => handleChangePage(page)}>
                                            Xem th??m
                                        </button> : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    user?.username ? (
                        <div className="col l-12 m-12 c-12">
                            <div className="home-product">
                                <div className="row sm-gutter section__item">
                                    <div className="col l-12 m-12 c-12">
                                        <div className="home-product-category-item">
                                            <h3 className="home-product-title">
                                                S???n ph???m d??nh cho b???n
                                            </h3>
                                        </div>
                                    </div>
                                    {
                                        loading ? <ProductItemSkeleton total={products.length} /> : <ProductItem products={recommendList} />
                                    }
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        </>
    )
}
export default HomePage;