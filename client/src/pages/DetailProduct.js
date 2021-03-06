import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link, useHistory } from 'react-router-dom';
import { API_URL } from 'actions/constants/constants'
import { getCurrentUser } from 'actions/services/UserActions'
import { addViewedProduct, getListProductMostPopular, getListProductViewedByUser, getOneItem } from 'actions/services/ProductServices'
import { addLikeProduct, deleteProductLiked, getProductLiked } from 'actions/services/ProductServices'
import { getAllCommentByProductId } from 'actions/services/CommentServices'
import { getListRecommendForUser, getSimilarProduct } from 'actions/services/RecommendServices'
import { addProductToCart, getCartInfo } from 'actions/services/CartActions'
import "react-toastify/dist/ReactToastify.css";
import useTimeout from 'hooks/useTimeout';
import DetailProductSkeleton from 'components/Loading/DetailProductSkeleton';
import DetailsThumbnail from 'components/Item/DetailThumbnail';
import ProductItem from 'components/Item/ProductItem';
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton';
import BrandProduct from 'components/Brand/BrandProduct';
import { toast } from 'react-toastify';

function DetailProduct(props) {

    const dispatch = useDispatch();
    const history = useHistory();
    const { match } = props;

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [index, setIndex] = useState(0);
    const [productLiked, setProductLiked] = useState(false);
    const [productViewed, setProductViewedd] = useState([]);
    const [mostPopularProduct, setMostPopularProduct] = useState([]);
    const [comments, setComments] = useState([]);
    const username = localStorage.getItem('username')
    const params = new URLSearchParams(window.location.search)
    const color = params.get('color') ? params.get('color') : '';
    const [similarProduct, setSimilarProduct] = useState([]);
    const [recommendList, setRecommendList] = useState([]);

    const getUser = useCallback(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    const myRef = React.createRef();

    const handleTab = index => {
        setIndex(index);
        const images = myRef.current.children;
        for (let i = 0; i < images.length; i++) {
            images[i].className = images[i].className.replace("active", "");
        }
        images[index].className = "active";
    };

    const addQuery = (key, value) => {
        let pathname = window.location.pathname;
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        history.push({
            pathname: pathname,
            search: searchParams.toString(),
        });
    };

    const getComment = useCallback(() => {
        const id = match.params.id;
        getAllCommentByProductId(id)
            .then((res) => {
                setComments(res.data)
            })
            .catch(err => alert(err))
    }, [match.params.id])

    useEffect(() => {
        const id = match.params.id;
        getOneItem(id, color)
            .then((res) => {
                setProduct(res.data);
                getSimilarProduct(res.data?.features.split(','), res.data?.category.code)
                    .then((res) => setSimilarProduct(res.data))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        getComment();
        if (username) {
            addViewedProduct({ productId: id })
                .then(() => { })
                .catch(() => { })
            getListProductViewedByUser()
                .then((res) => {
                    setProductViewedd(res)
                })
                .catch(() => setProductViewedd([]))
            getListRecommendForUser()
                .then((res) => {
                    setRecommendList(res)
                })
                .catch(() => setRecommendList([]))
            getProductLiked(id)
                .then((res) => {
                    if (res.data === true) {
                        setProductLiked(true)
                    }
                })
                .catch(() => setProductLiked(false))
        }

        console.log(recommendList);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, getComment, match.params.id, username])

    useEffect(() => {
        if (myRef.current) {
            myRef.current.children[index].className = "active";
        }
    }, [index, myRef])

    useEffect(() => {
        getUser();
    }, [getUser])

    useEffect(() => {
        getListProductMostPopular()
            .then(res => setMostPopularProduct(res.data))
            .catch(() => setMostPopularProduct([]))
    }, [product])

    useEffect(() => {
        document.title = product.name ? `${product?.name} | Tiki` : "Th??ng tin s???n ph???m | Tiki"
    }, [product?.name])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    const handleAddToCart = () => {
        if (username) {
            const data = {
                cart_details: [{
                    product_id: product?.id,
                    quantity,
                    color: color
                }]
            }
            if (product?.in_stock > 0 && quantity <= product?.in_stock) {
                addProductToCart(data)
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
                    })
                    .catch((err) => {
                        toast.warning(err.response.data.message, {
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
        } else {
            props.history.push('/login')
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const displayComment = (numStar) => {
        let ratingStars = [];
        if (product) {
            for (let i = 0; i < 5; i++) {
                if (numStar === 5) {
                    ratingStars.push(<i key={i} className="fas fa-star" />)
                }
                else {
                    for (let j = 0; j < numStar; j++) {
                        ratingStars.push(<i key={j} className="fas fa-star" />);
                    }
                    for (let k = numStar; k < 5; k++) {
                        ratingStars.push(<i key={k} className="far fa-star" />);
                    }
                    break;
                }

            }
        }
        return ratingStars;
    }

    const displayStatusRating = (rating) => {
        let status = '';
        switch (rating) {
            case 5:
                status = "C???c k??? h??i l??ng";
                break;
            case 4:
                status = "H??i l??ng";
                break;
            case 3:
                status = "B??nh th?????ng";
                break;
            case 2:
                status = "Kh??ng h??i l??ng";
                break;
            case 1:
                status = "R???t kh??ng h??i l??ng";
                break;
            default:
                break;
        }
        return status;
    }

    const toggleLikeProduct = () => {
        if (username) {
            const data = {
                productId: product?.id,
            }
            if (productLiked) {
                deleteProductLiked(product?.id)
                    .then(() => setProductLiked(false))
                    .catch(() => alert("ERR"))
            } else {
                addLikeProduct(data)
                    .then(() => setProductLiked(true))
                    .catch(() => setProductLiked(false))
            }
        } else {
            props.history.push('/login');
        }

    }

    return (
        <>
            {!loading ? (
                <div className="row sm-gutter section__content">
                    <div className="breadcrumb">
                        <Link className="breadcrumb-item" to="/">Trang ch???</Link>
                        <Link className="breadcrumb-item" to={`/${product.category?.code}`}>
                            {product.category?.name}
                        </Link>
                        <Link className="breadcrumb-item" to={`/${product.category?.code}/${product.subcategory?.code}`}>{product.subcategory?.name}</Link>
                        <span className="breadcrumb-item">
                            <span>{product.name}</span></span>
                    </div>
                    <div className="col l-12 m-12 c-12">
                        <div className="product-info">
                            {/* ------   Grid -> Row -> Column  ------ */}
                            <div className="row sm-gutter section__item">
                                <div className="col l-5 m-4 c-12">
                                    <div className="left-thumbnail">
                                        {
                                            <img
                                                src={`${product && product?.images !== undefined && product?.images[index]}`}
                                                alt=""
                                                style={{ width: '444px', height: '444px', objectFit: 'contain' }} />
                                        }
                                        <div className="list-img">
                                            <DetailsThumbnail images={product && product?.images !== undefined && product?.images} tab={handleTab} myRef={myRef} />
                                        </div>
                                        <div className="left-bottom">
                                            <div className="share">
                                                <p>Chia s???:</p>
                                                <div className="share-social">
                                                    <img
                                                        src={`${API_URL}/images/facebook.png`}
                                                        alt="social-facebook" />
                                                    <img src={`${API_URL}/images/messenger.png`}
                                                        alt="social-messenger" />
                                                    <img
                                                        src={`${API_URL}/images/copy.png`}
                                                        alt="social-copy" />
                                                </div>
                                                <div className="like">
                                                    {
                                                        productLiked
                                                            ?
                                                            <img src={`${API_URL}/images/liked.png`} onClick={toggleLikeProduct} alt="social-liked" />
                                                            :
                                                            <img src={`${API_URL}/images/like.png`} onClick={toggleLikeProduct} alt="social-like" />
                                                    }
                                                    <p>{productLiked ? '???? th??ch' : 'Th??ch'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col l-7 m-6 c-12">
                                    <div className="product-detail">
                                        <h4 className="product-name">{product.name}</h4>
                                        <div className="product-detail-info">
                                            <p className="product-review"><span>{product?.review_count}</span> ????nh Gi??</p>
                                            <p className="product-seller"><span>{product?.seller_count}</span> ???? B??n </p>
                                        </div>
                                    </div>
                                    <div className="product-detail-body">
                                        <div className="left">
                                            <p className="product-price">
                                                <span className="product-price__current-price">{currency(product.price)}</span>
                                                <span className="product-price__list-price">{currency(product.list_price)}</span>
                                                <span className="product-price__discount">{product.percent_discount}% gi???m</span>
                                            </p>
                                            <div className="product_pick_color">
                                                <div className="prco_label">
                                                    C?? <strong>{product?.inventories?.length} M??u s???c</strong>.
                                                    B???n ??ang ch???n <strong>{color ? color : product?.inventories[0].color}</strong></div>
                                                <div className="color color_cover">
                                                    {
                                                        product?.inventories.map((item, index) => {
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    className={`opt-var opt-var-97020 ${color === item.color || product?.inventories.length === 1 || (index === 0 && !color) ? 'active' : ''}`}
                                                                    title={item.color}
                                                                    onClick={() => addQuery('color', item.color)}
                                                                >
                                                                    <span>{item.color}</span>
                                                                    <input
                                                                        type="hidden" />
                                                                    <span className="prv-price">
                                                                        <span>{currency(product?.price)}</span>
                                                                    </span>
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div id="info-1" className="collapse in">
                                                <div className="input-label">
                                                    <span>S??? l?????ng</span>
                                                </div>

                                                <div className="group-input">
                                                    <button
                                                        className={quantity <= 1 ? 'disable' : ''}
                                                        disabled={quantity <= 1}
                                                        onClick={() => setQuantity(quantity - 1)}>
                                                        <img src={`${API_URL}/images/remove.png`} alt="remove-icon" width={20} height={20} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="input"
                                                        pattern="^[1-9]\d*"
                                                        value={quantity <= 0 ? 1 : quantity >= product.in_stock ? product.in_stock : quantity}
                                                        onChange={(e) => setQuantity(parseInt(e.target.value) <= 1 ? 1 : parseInt(e.target.value) >= product.in_stock ? product.in_stock : parseInt(e.target.value))}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setQuantity(quantity + 1)}
                                                        className={quantity >= product.in_stock ? 'disable' : ''}
                                                        disabled={quantity >= product.in_stock}>
                                                        <img src={`${API_URL}/images/add.png`} alt="add-icon" width={20} height={20} />
                                                    </button>
                                                </div>
                                                <div className="input-label">
                                                    {
                                                        product.in_stock > 0 ? <span>{product.in_stock} s???n ph???m c?? s???n</span> : <span>H???t h??ng</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="group-button">
                                                <button
                                                    className="btn btn-add-to-cart"
                                                    onClick={handleAddToCart}
                                                >Th??m v??o gi??? h??ng</button>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <BrandProduct brand={product.brand} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            S???n ph???m t????ng t???
                                        </h3>
                                    </div>
                                </div>
                                {
                                    loading ? <ProductItemSkeleton total={similarProduct.length} /> : <ProductItem products={similarProduct} />
                                }
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            Th??ng tin chi ti???t
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    <div className="group">
                                        <div className="content has-table">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>Th????ng hi???u</td>
                                                        <td>{product.brand?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Xu???t x??? th????ng hi???u</td>
                                                        <td>{product.brand?.madeIn}</td>
                                                    </tr>
                                                    {
                                                        product.product_specs.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.attributeName}</td>
                                                                    <td>{item.attributeValue}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            M?? t??? s???n ph???m
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    <div className="group">
                                        <div className="content" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            ????nh gi??, nh???n x??t t??? kh??ch h??ng
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    {
                                        comments.length === 0 ? (
                                            <div className="customer-reviews__empty">
                                                <img src={`${API_URL}/images/star.png`} alt="" />
                                                <span>Ch??a c?? ????nh gi?? n??o cho s???n ph???m n??y</span>
                                            </div>
                                        ) :
                                            comments.map((item) => {
                                                return (
                                                    <div className="review-comment" key={item.id}>
                                                        <div className="review-comment__user">
                                                            <div className="review-comment__user-inner">
                                                                <div className="review-comment__user-avatar">
                                                                    <div className="has-character">
                                                                        <img src={`${API_URL}/images/avatar.png`} alt="" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="review-comment__user-name">{item.displayName}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ flexGrow: 1 }}>
                                                            <div className="review-comment__rating-title">
                                                                <div className="review-comment__rating">
                                                                    {displayComment(item.rating)}
                                                                </div>
                                                                <span className="review-comment__title">
                                                                    {displayStatusRating(item.rating)}
                                                                </span>
                                                            </div>
                                                            <div className="review-comment__seller-name-attributes">
                                                                <div className="review-comment__seller-name">Th????ng hi???u<span className="review-comment__check-icon" />{product.brand?.name}</div>
                                                            </div>
                                                            <div className="review-comment__content">{item.content}</div>
                                                            <div className="review-comment__created-date">
                                                                <span>Nh???n x??t v??o {item.date_comment}</span>
                                                            </div>
                                                            <span className="review-comment__reply">G???i tr??? l???i</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                            {/* <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            S???n ph???m ph??? bi???n nh???t
                                        </h3>
                                    </div>
                                </div>
                                {
                                    loading ? <ProductItemSkeleton total={mostPopularProduct.length} /> : <ProductItem products={mostPopularProduct} />
                                }
                            </div> */}
                            {
                                recommendList?.length > 0 ? (
                                    <div className="row sm-gutter section__item">
                                        <div className="col l-12 m-12 c-12">
                                            <div className="home-product-category-item">
                                                <h3 className="home-product-title">
                                                    S???n ph???m d??nh cho b???n
                                                </h3>
                                            </div>
                                        </div>
                                        {
                                            loading ? <ProductItemSkeleton total={recommendList?.length} /> : <ProductItem products={recommendList} />
                                        }
                                    </div>
                                ) : ''
                            }
                            {
                                productViewed?.length > 0 ? (
                                    <div className="row sm-gutter section__item">
                                        <div className="col l-12 m-12 c-12">
                                            <div className="home-product-category-item">
                                                <h3 className="home-product-title">
                                                    S???n ph???m b???n ???? xem
                                                </h3>
                                            </div>
                                        </div>
                                        {
                                            loading ? <ProductItemSkeleton total={productViewed?.length} /> : <ProductItem products={productViewed} />
                                        }
                                    </div>
                                ) : ''
                            }
                        </div>
                    </div>
                </div>
            ) : <DetailProductSkeleton />
            }
        </>
    )
}
export default DetailProduct;