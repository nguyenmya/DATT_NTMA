import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Filter from 'components/Filter/Filter';
import Title from 'components/Filter/Title';
import Product from 'components/Item/Product';
import Pagination from 'components/Pagination/Pagination';
import { getProductListByCategoryAndSubcategory, getProductList } from 'actions/services/ProductServices'
import useTimeout from 'hooks/useTimeout';
import ProductSkeleton from 'components/Item/ProductSkeleton';
import Loading from 'components/Loading/Loading';

function ListProductPage(props) {
    const { match } = props;
    const [products, setProducts] = useState([]);
    const [totalElements, setTotalElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page');
    const sortBy = params.get('sort_by') ? params.get('sort_by') : '';
    const sortValue = params.get('sort_value') ? params.get('sort_value') : '';
    const keyword = params.get('keyword') ? params.get('keyword') : '';
    const price = params.get('price') ? params.get('price') : '';
    const brand = params.get('brand') ? params.get('brand') : '';
    const ram = params.get('ram') ? params.get('ram') : '';
    const resolution = params.get('resolution') ? params.get('resolution') : '';
    const image = params.get('image') ? params.get('image') : '';
    const video = params.get('video') ? params.get('video') : '';
    const smart_tv = params.get('smart_tv') ? params.get('smart_tv') : '';
    const tv_3d = params.get('tv_3d') ? params.get('tv_3d') : '';
    useEffect(() => {
        document.title = "Danh sách sản phẩm giá cực tốt"
        let searchObject = {};
        searchObject.keyword = keyword ? keyword : '';
        searchObject.page = page ? parseInt(page) : 1;
        const category = match.params.category ? match.params.category : '';
        const subcategory = match.params.subcategory ? match.params.subcategory : '';
        searchObject.category = category;
        searchObject.subcategory = subcategory;
        searchObject.sortBy = sortBy ? sortBy : '';
        searchObject.sortValue = sortValue ? sortValue : '';
        searchObject.brand = brand ? brand : '';
        searchObject.price = price ? price : '';
        searchObject.ram = ram ? ram : '';
        searchObject.resolution = resolution ? resolution : '';
        searchObject.image = image ? image : '';
        searchObject.video = video ? video : '';
        searchObject.smart_tv = smart_tv ? smart_tv : '';
        searchObject.tv_3d = tv_3d ? tv_3d : '';
        if (category !== '' && category) {
            getProductListByCategoryAndSubcategory(searchObject)
                .then((res) => {
                    setProducts(res.data.content);
                    setTotalElements(res.data.totalElements)
                })
                .catch(err => console.log(err))
        } else {
            getProductList(searchObject)
                .then((res) => {
                    setProducts(res.data.content);
                    setTotalElements(res.data.totalElements)
                })
                .catch(err => console.log(err))
        }
    }, [page, match, brand, keyword, sortBy, sortValue, price, ram, resolution, image, video, smart_tv, tv_3d])


    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="row sm-gutter section__content">
                <Filter category={match.params.category} history={props.history} />
                {
                    loading ? <Loading /> : (
                        products?.length > 0 ? (
                            <div className="col l-9-4 m-12 c-12">
                                <div className="home-product">
                                    <div className="row sm-gutter section__item">
                                        <Title type={match.params.category} totalProducts={totalElements} />
                                        {
                                            loading ? <ProductSkeleton total={totalElements} /> : <Product products={products} />
                                        }
                                    </div>

                                </div>
                                <Pagination totalRows={totalElements} page={page ? page : 1} limit={20} />
                            </div>
                        ) :
                            <div className="col l-9-4 m-12 c-12">
                                <div className="home-product">
                                    <div className="row sm-gutter section__item">
                                        <h3 style={{ fontSize: '1.5rem', textAlign: 'center', padding: '50px 0', width: '100%', height: '100%' }}>Không tìm thấy sản phẩm cần  tìm</h3>
                                    </div>
                                </div>
                            </div>
                    )
                }
            </div>
        </>
    )
}

export default ListProductPage;