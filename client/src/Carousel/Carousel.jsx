import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import "./carousel.css";
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}
const categories = [
    {
        title: 'Laptop',
        img: 'https://cdn.tgdd.vn/Products/Images/44/265015/TimerThumb/263977.jpg',
        url: '/laptop/laptop-gaming'
    },
    {
        title: 'Điện thoại',
        img: 'https://cdn.tgdd.vn/2022/06/campaign/checkout-xanh-310x354.png',
        url: '/dien-thoai/dien-thoai-smartphone'
    },
    // {
    //   title: 'Điện thoại Iphone',
    //   img: 'https://salt.tikicdn.com/cache/200x200/ts/product/bf/2b/10/752c9ebfd2444816669275cfc4457f88.jpg.webp',
    //   url: '/dien-thoai?brand=iphone'
    // },
    // {
    //   title: 'Điện thoại Samsung',
    //   img: 'https://salt.tikicdn.com/cache/200x200/ts/product/a2/0e/21/8370177bf6874a6a3f219a825980c3c2.jpg.webp',
    //   url: '/dien-thoai?brand=samsung'
    // },
    {
        title: 'Máy giặt',
        img: 'https://s.meta.com.vn/img/thumb.ashx/200x200x95/Data/image/2019/11/11/tu-lanh-side-by-side-samsung-inverter-rs62r5001b4-sv-647-lit-400.jpg',
        url: '/may-giat'
    },

    {
        title: 'Tai Nghe True Wireless',
        img: 'https://salt.tikicdn.com/cache/200x200/ts/product/8a/3d/30/ce3c3ceb11a008951fc5fc0d4e33bb4a.JPG.webp',
        url: '/thiet-bi-phu-kien/phu-kien-dien-thoai'
    },
    {
        title: 'Laptop DELL',
        img: 'https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633948546171_dell-vostro-1.jpg?alt=media&token=ecaf9446-2dd2-4cf7-964f-7d21128630db',
        url: '/laptop?brand=DELL'
    },
    {
        title: 'Smart TV',
        img: 'https://salt.tikicdn.com/cache/200x200/media/catalog/producttmp/01/de/fd/0c4c0ba101d2e003f9d150827a50b85a.jpg.webp',
        url: '/tivi/smart-tivi'
    },
    {
        title: 'Bàn phím máy tính',
        img: 'https://salt.tikicdn.com/cache/200x200/ts/product/eb/3c/1b/82106ff647b31ce0d94eb97fb85a39b8.jpg.webp',
        url: '/thiet-bi-phu-kien/phu-kien-laptop'
    },
    {
        title: 'Macbook',
        img: 'https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633966039280_mac-1.jpg?alt=media&token=d960b4fd-f5a2-4ce0-a25a-d5a0e29f7f1d',
        url: '/laptop?brand=apple'
    },
    {
        title: 'Điện thoại Vivo',
        img: 'https://salt.tikicdn.com/cache/200x200/ts/product/b3/95/fc/70f6724a71608f645d6435ebf5e0039b.jpg.webp',
        url: '/dien-thoai?brand=vivo'
    },
    {
        title: 'Điện thoại OPPO',
        img: 'https://salt.tikicdn.com/cache/200x200/ts/product/4a/93/0d/10c4a72688d0c7c0d3fe9f30548ac419.jpg.webp',
        url: '/dien-thoai?brand=oppo'
    },
    {
        title: 'Inverter TV',
        img: 'https://cdn.tgdd.vn/Files/2019/11/25/1222206/cong-nghe-inverter-la-gi-co-loi-ich-gi-co-tren-thiet-bi-nao--10.jpg',
        url: '/tivi?smart_tv=0'
    },
    {
        title: 'Máy quay',
        img: 'https://cdn.nguyenkimmall.com/images/companies/_1/Content/ky-thuat-so/may-quay-phim/sony/may-quay-phim-sony-fdr-ax40-1.jpg',
        url: '/may-anh'
    },
    {
        title: 'Ốp điện thoại',
        img: 'https://vn-live-05.slatic.net/p/a16859945df7cb8e46d685f874978855.jpg_720x720q80.jpg_.webp',
        url: '/thiet-bi-phu-kien/phu-kien-dien-thoai'
    },
    {
        title: 'Máy tính bảng',
        img: 'https://img.websosanh.vn/v10/users/review/images/rutf9j8dr5f8p/1545982472202_8929913.jpg?compress=85',
        url: '/may-tinh-bang'
    },
    {
        title: 'Máy đọc sách',
        img: 'https://maydocsachtot.com/wp-content/uploads/2018/03/may_doc_sach_la_gi-580x405.jpg',
        url: '/may-tinh-bang/may-doc-sach-kindle'
    },
    {
        title: 'Máy ảnh',
        img: 'https://vn.canon/media/image/2020/06/19/7a87af2d22694164b6850009342614ec_Thumbnail+570x400.jpg',
        url: '/may-anh'
    },
    {
        title: 'Máy giặt',
        img: 'https://salt.tikicdn.com/cache/200x200/ts/product/1c/20/8c/f091449b9d6175a7fff66213dca5da8c.jpg.webp',
        url: '/may-giat'
    },
    {
        title: 'Máy ảnh du lịch',
        img: 'https://cdn.nguyenkimmall.com/images/companies/_1/SEO/top-5-may-anh-du-lich/may-anh-fujifilm-xq2-thiet-ke-nho-gon.jpg',
        url: '/may-anh/may-anh-du-lich'
    }
]

const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
        {
            breakpoint: 1324,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 770,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

export default function Carousel() {
    return (
        <div className=" container Product__content">
            {/* <h2>Popular professional services</h2> */}
            <Slider {...settings}>
                {
                    categories.map((item, index) => {
                        return (
                            <div className="container" style={{marginTop:"10px"}}>
                                <Link to={item.url} className="featured__body-item" key={index}>
                                    <img className="carousel" src={item.img} alt="" style={{ width: "200px", height: "200px" }} />
                                    <span style={{ color: "black", }}>{item.title}</span>
                                </Link>
                            </div>

                        )
                    })
                }
            </Slider>
        </div>
    );
}
