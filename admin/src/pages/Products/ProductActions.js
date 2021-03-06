import { Button, makeStyles, LinearProgress } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from '../../constants';
import { addProduct, getOneItem, updateProduct } from 'services/ProductServices';
// import { uploadImage } from 'services/UploadFileService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";
import './style.css'
import InputField from 'components/input/InputField';
import SelectField from 'components/input/SelectField';
// import AutocompleteField from 'components/input/AutoCompleteField';
import { getAllCategory } from 'services/CategoryServices';
import ImageUploading from "react-images-uploading";
import { useHistory } from 'react-router-dom';
import { storage } from 'utils/firebase'
import { getAll as getAllColor } from 'services/ColorServices';
import { properties } from './properties'
import { removeVNE } from 'utils/makeSlug'
// import FileUploadIcon from '@material-ui/icons/FileUpload';

toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
    button: {
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: '1.3rem',
        marginRight: 15,
        marginBottom: 30
    }
}))



function ProductActions(props) {
    const classes = useStyles();
    const history = useHistory();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        categories: [],
        subcategories: [],
        brands: [],
        suppliers: [],
        tags: []
    })

    const [colors, setColors] = useState([]);

    const maxNumber = 69;
    // const [imagesUpload, setImagesUpload] = useState([]);

    const [urlMainImage, setUrlMainImage] = useState('');
    const [urlsListImage, setUrlsListImage] = useState([]);
    const [progressMainUpload, setProgressMainUpload] = useState(0);
    const [progressListUpload, setProgressListUpload] = useState(0);


    const [product, setProduct] = useState({
        id: null,
        type: null,
        name: '',
        sku: '',
        model: '',
        price: 0,
        list_price: 0,
        description: '',
        category: '',
        subcategory: '',
        brand: '',
        supplier: '',
        sizeWeight: null,
        material: null,
        features: '',

        // color
        colors: [],
        // main & child image
        mainImage: '',
        images: [],

        // th??ng tin v???n chuy???n
        weight: 0,
        length: 0,
        width: 0,
        height: 0,

        // electric 
        screen: null,
        screen_size: null,
        operatorSystem: null,
        display_resolution: null,
        camera: null,
        ram: null,
        chip: null,
        pin: null,
        design: null,
        releaseTime: null,

        // phone
        frontCamera: null,
        behindCamera: null,
        internalMemory: null,
        sim: null,
        number_sim: null,
        accessory: null,

        // laptop
        cpu: null,
        bus: null,
        hardWare: null,
        card: null,

        // camera
        image_processing: null,
        image_quality: null,
        video_quality: null,
        memory_card: null,
        screen_camera: null,
        screen_size_camera: null,
        shutter_speed: null,

        // tivi
        year: null,
        display_resolution_tv: null,
        type_tv: null,
        app_avaiable: null,
        usb: null,
        is3D: null,
        speaker: null,
        techlonogy_sound: null,
        component_video: null,
        hdmi: null,
        image_processing_tv: null,

        // wash
        wash_weight: null,
        wash_mode: null,
        is_fast: null,
        wash_tub: null,
        is_inverter: null,

        // accessory - phu kien
        feature: null,
        accessory_model: null

    });

    const onChangeUploadMainImage = (imageList, addUpdateIndex) => {
        const image = imageList[0].file;
        const now = new Date().getTime();
        const uploadTask = storage.ref(`images/product/${now + '_' + image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgressMainUpload(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images/product")
                    .child(now + '_' + image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrlMainImage(url);
                        toast.success("Upload h??nh ???nh th??nh c??ng!");
                    });
            }
        );
    };

    const onChangeUploadImage = (imageList, addUpdateIndex) => {
        const imageFiles = imageList.map(item => item.file);
        // uploadImage(imageFiles)
        //     .then((res) => {
        //         setImagesUpload([
        //             ...imagesUpload,
        //             ...res.data
        //         ]);
        //     })
        //     .catch((err) => console.log(err))
        const promises = [];
        const now = new Date().getTime();
        imageFiles.map((image) => {
            const uploadTask = storage.ref(`images/product/${now + '_' + image?.name}`).put(image);
            promises.push(uploadTask);
            return uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgressListUpload(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await storage
                        .ref("images/product")
                        .child(now + '_' + image.name)
                        .getDownloadURL()
                        .then((urls) => {
                            setUrlsListImage((prevState) => [...prevState, urls]);
                        });
                }
            );
        });
        Promise.all(promises)
            .then(() => toast.success("Upload h??nh ???nh th??nh c??ng!"))
            .catch(() => toast.warning("Upload h??nh ???nh kh??ng th??nh c??ng!"));
    };

    // const handleRemoveImage = (image) => {
    //     const newArray = urlsListImage.filter((item) => item !== image);
    //     // setImagesUpload(newArray);
    //     var desertRef = storage.refFromURL(`${image}`);
    //     desertRef.delete().then(function () {
    //         toast.success("Xo?? h??nh ???nh th??nh c??ng!")
    //         setUrlsListImage(newArray)
    //         setProduct({
    //             ...product,
    //             images: newArray
    //         })
    //     }).catch(function (error) {
    //         toast.error("Xo?? h??nh ???nh kh??ng th??nh c??ng!")
    //     });
    // }

    // const handleRemoveMainImage = () => {
    //     var desertRef = storage.refFromURL(urlMainImage);
    //     desertRef.delete().then(function () {
    //         toast.success("Xo?? h??nh ???nh th??nh c??ng!")
    //         setUrlMainImage('')
    //         setProgressMainUpload(0)
    //     }).catch(function (error) {
    //         toast.error("Xo?? h??nh ???nh kh??ng th??nh c??ng!")
    //     });
    // }

    // const handleRemoveAllImage = () => {
    //     const promises = [];
    //     urlsListImage.map(url => promises.push(storage.refFromURL(`${url}`).delete()))
    //     Promise.all(promises)
    //         .then(() => {
    //             progressListUpload(0);
    //             setUrlsListImage([]);
    //             toast.success("Xo?? h??nh ???nh th??nh c??ng!");
    //         })
    //         .catch(() => toast.warning("Xo?? h??nh ???nh kh??ng th??nh c??ng!"));
    // }

    const handleChange = (e) => {
        const value = e.target.value;
        setProduct({
            ...product,
            [e.target.name]: value,
        });
    };

    // const handleChangeAutocomplete = (event, value) => {
    //     setProduct({
    //         ...product,
    //         tags: value,
    //     });
    // };
    const handleChangeEditor = (content, editor) => {
        setProduct({
            ...product,
            description: content
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let newData = { ...product };
        const mainImage = urlMainImage
        const images = urlsListImage;
	const material = product.material ? removeVNE(product.material) : '';
        const screen = product.screen ? removeVNE(product.screen) : '';
        const screen_size = product.screen_size ? removeVNE(product.screen_size) : '';
        const operatorSystem = product.operatorSystem ? removeVNE(product.operatorSystem) : '';
        const display_resolution = product.display_resolution ? removeVNE(product.display_resolution) : '';
        const camera = product.camera ? removeVNE(product.camera) : '';
        const ram = product.ram ? 'ram' + removeVNE(product.ram) : '';
        const chip = product.chip ? removeVNE(product.chip) : '';
        const pin = product.pin ? removeVNE(product.pin) : '';
        const design = product.design ? removeVNE(product.design) : '';
        const releaseTime = product.releaseTime ? removeVNE(product.releaseTime) : '';
        // phone
        const frontCamera = product.frontCamera ? removeVNE(product.frontCamera) : '';
        const behindCamera = product.behindCamera ? removeVNE(product.behindCamera) : '';
        const internalMemory = product.internalMemory ? removeVNE(product.internalMemory) : '';
        const sim = product.sim ? removeVNE(product.sim) : '';
        // laptop
        const cpu = product.cpu ? removeVNE(product.cpu) : '';
        const bus = product.bus ? removeVNE(product.bus) : '';
        const hardWare = product.hardWare ? removeVNE(product.hardWare) : '';
        const card = product.card ? removeVNE(product.card) : '';
        // camera
        const image_processing = product.image_processing ? removeVNE(product.image_processing) : '';
        const image_quality = product.image_quality ? removeVNE(product.image_quality) : '';
        const video_quality = product.video_quality ? removeVNE(product.video_quality) : '';
        const memory_card = product.memory_card ? removeVNE(product.memory_card) : '';
        const screen_camera = product.screen_camera ? removeVNE(product.screen_camera) : '';
        const screen_size_camera = product.screen_size_camera ? removeVNE(product.screen_size_camera) : '';
        const shutter_speed = product.shutter_speed ? removeVNE(product.shutter_speed) : '';

        // tivi
        const year = product.year ? removeVNE(product.year) : '';
        const display_resolution_tv = product.display_resolution_tv ? removeVNE(product.display_resolution_tv) : '';
        const type_tv = product.type_tv === '1' || product.type_tv === 1 ? removeVNE('Smart TV') : 'Inverter TV';
        const app_avaiable = product.app_avaiable ? removeVNE(product.app_avaiable) : '';
        const usb = product.usb ? removeVNE(product.usb) : '';
        const is3D = product.is3D === '1' || product.is3D === 1 ? removeVNE('3DTV') : 'NormalTV';
        const techlonogy_sound = product.techlonogy_sound ? removeVNE(product.techlonogy_sound) : '';
        const component_video = product.component_video ? removeVNE(product.component_video) : '';
        const hdmi = product.hdmi ? removeVNE(product.hdmi) : '';
        const image_processing_tv = product.image_processing_tv ? removeVNE(product.image_processing_tv) : '';

        // wash
        const wash_weight = product.wash_weight ? removeVNE(product.wash_weight) : '';
        const wash_mode = product.wash_mode ? removeVNE(product.wash_mode) : '';
        const is_fast = product.is_fast === '1' || product.is_fast === 1 ? removeVNE('wash fast') : 'wash normal';
        const wash_tub = product.wash_tub ? removeVNE(product.wash_tub) : '';
        const is_inverter = product.is_inverter === '1' || product.is_inverter === 1 ? removeVNE('wash inverter') : 'wash normal';

        // accessory - phu kien
        const feature = product.feature ? removeVNE(product.feature) : '';
        const accessory_model = product.accessory_model ? removeVNE(product.accessory_model) : ''
        let features = '';

        switch (newData.category) {
            case 'laptop':
                newData.type = 1;
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + screen + ',' + screen_size + ',' + operatorSystem + ',' + display_resolution + ',' + camera + ',' + ram + ',' + chip + ',' + pin + ',' + design + ',' + releaseTime
                    + ',' + cpu + ',' + bus + ',' + hardWare + ',' + card;
                break;
            case 'dien-thoai':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + screen + ',' + screen_size + ',' + operatorSystem + ',' + display_resolution + ',' + camera + ',' + ram + ',' + chip + ',' + pin + ',' + design + ',' + releaseTime
                    + ',' + frontCamera + ',' + behindCamera + ',' + internalMemory + ',' + sim;
                newData.type = 1;
                break;
            case 'dienthoai':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + screen + ',' + screen_size + ',' + operatorSystem + ',' + display_resolution + ',' + camera + ',' + ram + ',' + chip + ',' + pin + ',' + design + ',' + releaseTime
                    + ',' + frontCamera + ',' + behindCamera + ',' + internalMemory + ',' + sim;
                newData.type = 1;
                break;
            case 'may-tinh-bang':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + screen + ',' + screen_size + ',' + operatorSystem + ',' + display_resolution + ',' + camera + ',' + ram + ',' + chip + ',' + pin + ',' + design + ',' + releaseTime
                    + ',' + frontCamera + ',' + behindCamera + ',' + internalMemory + ',' + sim;
                newData.type = 1;
                break;
            case 'maytinhbang':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + screen + ',' + screen_size + ',' + operatorSystem + ',' + display_resolution + ',' + camera + ',' + ram + ',' + chip + ',' + pin + ',' + design + ',' + releaseTime
                    + ',' + frontCamera + ',' + behindCamera + ',' + internalMemory + ',' + sim;
                newData.type = 1;
                break;
            case 'may-anh':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + image_processing + ',' + image_quality + ',' + video_quality + ',' + memory_card + ',' + screen_camera + ',' + screen_size_camera + ',' + shutter_speed;
                newData.type = 2;
                break;
            case 'mayanh':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + image_processing + ',' + image_quality + ',' + video_quality + ',' + memory_card + ',' + screen_camera + ',' + screen_size_camera + ',' + shutter_speed;
                newData.type = 2;
                break;
            case 'camera':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + image_processing + ',' + image_quality + ',' + video_quality + ',' + memory_card + ',' + screen_camera + ',' + screen_size_camera + ',' + shutter_speed;
                newData.type = 2;
                break;
            case 'tivi':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + year + ',' + display_resolution_tv + ',' + type_tv + ',' + app_avaiable + ',' + usb + ',' + is3D + ',' + techlonogy_sound + ',' + component_video + ',' + hdmi + ',' + image_processing_tv;
                newData.type = 3;
                break;
            case 'may-giat':
                features += removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + wash_weight + ',' + wash_mode + ',' + wash_tub + ',' + is_fast + ',' + is_inverter;
                newData.type = 4;
                break;
            case 'thiet-bi-phu-kien':
                var productName = '';
                if (newData.name.toLowerCase().includes('tai nghe')) {
                    productName += 'tai nghe';
                } else if (newData.name.toLowerCase().includes('bluetooth')) {
                    productName += 'bluetooth';
                } else if (newData.name.toLowerCase().includes('gi?? ?????')) {
                    productName += 'gi?? ?????';
                } else if (newData.name.toLowerCase().includes('???p ??i???n tho???i')) {
                    productName += '???p ??i???n tho???i';
                } else if (newData.name.toLowerCase().includes('d??? ph??ng')) {
                    productName += 's???c d??? ph??ng';
                } else if (newData.name.toLowerCase().includes('chu???t')) {
                    productName += 'chu???t m??y t??nh';
                } else if (newData.name.toLowerCase().includes('b??n ph??m')) {
                    productName += 'b??n ph??m';
                } else if (newData.name.toLowerCase().includes('kh??ng d??y')) {
                    productName += 'kh??ng d??y';
                } else if (newData.name.toLowerCase().includes('c?????ng l???c')) {
                    productName += 'k??nh c?????ng l???c';
                } else if (newData.name.toLowerCase().includes('th??? nh???')) {
                    productName += 'th??? nh???';
                } else if (newData.name.toLowerCase().includes('usb')) {
                    productName += 'usb';
                } else if (newData.name.toLowerCase().includes('webcam')) {
                    productName += 'webcam';
                } else if (newData.name.toLowerCase().includes('tay c???m')) {
                    productName += 'tay c???m';
                } else if (newData.name.toLowerCase().includes('ch???ng rung')) {
                    productName += 'ch???ng rung';
                } else {
                    productName += newData.name;
                }

                features += removeVNE(productName) + ',' + removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + feature + ',' + accessory_model;
                newData.type = 5;
                break;
            case 'phu-kien':
                features += removeVNE(productName) + ',' + removeVNE(product.brand) + ',' + removeVNE(product.category) + ',' + removeVNE(product.subcategory) + ',' + material + ',' + feature + ',' + accessory_model;
                newData.type = 5;
                break;
            default:
                newData.type = 1;
                break;
        }
        if (newData.id) {
            newData.images = images;
            newData.mainImage = mainImage;
            newData.features = features.split(',').filter(item => {
                return item !== ''
            }).join(',');
            // console.log(newData);
            updateProduct(newData)
                .then(() => {
                    toast.success("C???p nh???t s???n ph???m th??nh c??ng");
                    history.goBack();
                })
                .catch(() => {
                    toast.error("C???p nh???t s???n ph???m kh??ng th??nh c??ng");
                })
        } else {
            newData.images = images;
            newData.mainImage = mainImage;
            newData.features = features.split(',').filter(item => {
                return item !== ''
            }).join(',');
            // console.log(newData);
            addProduct(newData)
                .then(() => {
                    toast.success("Th??m s???n ph???m th??nh c??ng");
                    history.goBack();
                })
                .catch(() => {
                    toast.error("Th??m s???n ph???m kh??ng th??nh c??ng");
                })
        }

    }

    let title = props.match.params.id ? `C???p nh???t th??ng tin s???n ph???m c?? id: ${props.match.params.id}` : "Th??m m???i s???n ph???m";

    const fetchData = useCallback(() => {
        let searchObj = {};
        searchObj.limit = 1000;
        searchObj.page = 0;
        searchObj.display = 1;
        getAllCategory(searchObj)
            .then(res => {
                setData({
                    ...data,
                    categories: res.data.content,
                })
            }, [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchDataOther = useCallback(() => {

        const config = { headers: headers };
        if (product.category !== '') {
            const getAllSubcategory = axios.get(`${API_URL}/api/subcategory/category?category=${product.category}`);
            const getAllBrand = axios.get(`${API_URL}/api/brand/all`, config);
            const getAllSupplier = axios.get(`${API_URL}/api/supplier/all?page=${0}&limit=${10}`, config);
            axios.all([getAllSubcategory, getAllBrand, getAllSupplier]).then(
                axios.spread((...allData) => {
                    const allSubcategory = allData[0].data;
                    const allBrand = allData[1].data.content;
                    const allSupplier = allData[2].data.content;
                    setData({
                        ...data,
                        subcategories: allSubcategory,
                        brands: allBrand,
                        suppliers: allSupplier,
                    })
                })
            )
        } else {
            setData({
                ...data,
                subcategories: [],
                brands: [],
                suppliers: [],
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.category])


    const getAllColorAndTags = useCallback(() => {
        const search = {
            page: 0,
            limit: 200
        }
        getAllColor(search)
            .then(res => {
                setColors(res.data.content);
            })
    }, [])

    const getProductInfo = useCallback(() => {
        const id = props.match.params.id;
        if (id) {
            getOneItem(id)
                .then((res) => {
                    setProduct(res.data)
                    setUrlsListImage([
                        ...urlsListImage,
                        ...res.data.images
                    ])
                    setUrlMainImage(res.data.mainImage)
                    setLoading(false);
                })
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id])

    useEffect(() => {
        document.title = " Admin | Qu???n l?? s???n ph???m";
        getAllColorAndTags()
    }, [getAllColorAndTags])

    useEffect(() => {
        fetchData();
        fetchDataOther();
        getProductInfo();
    }, [fetchData, fetchDataOther, getProductInfo])
    console.log(product.subcategor)

    return <> {
        loading ? <LinearProgress color="secondary" /> : (
            <div>
                <h2 className="page-header">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="glOjBk list-cusomer-order">
                                    {/* <h2 className="heading">
                                        Th??ng tin c?? b???n
                                    </h2> */}
                                </div>
                                <div className="card__body">
                                    <div className="row">
                                        <div className="col-3">
                                            <InputField
                                                type="text"
                                                label="T??n s???n ph???m"
                                                name="name"
                                                value={product && product?.name}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <InputField
                                                type="text"
                                                label="M?? s???n ph???m"
                                                name="sku"
                                                value={product.sku ? product.sku : ""}
                                                onChange={handleChange}
                                                required={false}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <SelectField
                                                label="Danh m???c"
                                                value={product.category || ""}
                                                name="category"
                                                onChange={handleChange}
                                                data={data?.categories}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <SelectField
                                                label="Danh m???c con"
                                                value={product.subcategory || ""}
                                                name="subcategory"
                                                onChange={handleChange}
                                                data={data?.subcategories}
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <SelectField
                                                label="Th????ng hi???u"
                                                value={product.brand || ""}
                                                name="brand"
                                                onChange={handleChange}
                                                data={data?.brands}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <InputField
                                                type="number"
                                                label="Gi?? ni??m y???t"
                                                name="list_price"
                                                value={product.list_price || ''}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <InputField
                                                type="number"
                                                label="Gi?? b??n"
                                                name="price"
                                                value={product.price || ''}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <SelectField
                                                label="M??u s???c"
                                                value={product.colors || ['']}
                                                name="colors"
                                                onChange={handleChange}
                                                data={colors.map((item) => {
                                                    return {
                                                        name: item.name,
                                                        code: item.name
                                                    }
                                                })}
                                                // required={true}
                                                multiple={true}
                                            />
                                        </div>
                                        <div className="col-12 tiny-editor-margin">
                                            <Editor
                                                apiKey="0oiczdkt4b8lgo9kjmvrzsscibe0knl9d1cru6fr22ie2189"
                                                value={product?.description}
                                                init={{
                                                    height: 500,
                                                    menubar: false,
                                                    plugins: [
                                                        'advlist autolink lists link image charmap print preview anchor',
                                                        'searchreplace visualblocks code fullscreen',
                                                        'insertdatetime media table paste code help wordcount'
                                                    ],
                                                    toolbar:
                                                        'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                                                }}
                                                onEditorChange={handleChangeEditor}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="glOjBk list-cusomer-order">
                                    <h2 className="heading">
                                        Th??ng tin th??m
                                    </h2>
                                    <p style={{ color: 'red' }}>
                                        {product.category === '' ? 'Vui l??ng ch???n danh m???c s???n ph???m' : null}
                                    </p>
                                </div>

                                <div className="card__body">
                                    <div className="row">
                                        {
                                            properties.map((property) => {
                                                return property.category === product.category ? (
                                                    property.items.map((input, index) => {
                                                        if (input.type === 'select') {
                                                            return <div className="col-6" key={index}>
                                                                <SelectField
                                                                    label={input.label}
                                                                    name={input.name}
                                                                    value={product[`${input.name}`] || ""}
                                                                    onChange={handleChange}
                                                                    multiple={false}
                                                                    category={product.category}
                                                                    data={
                                                                        input.name === 'wash_tub' ? [
                                                                            {
                                                                                code: 'Ngang',
                                                                                name: 'Ngang'
                                                                            },
                                                                            {
                                                                                code: 'D???c',
                                                                                name: 'D???c'
                                                                            }
                                                                        ] : input.name === 'is_fast' ? [
                                                                            {
                                                                                code: '1',
                                                                                name: 'C??'
                                                                            },
                                                                            {
                                                                                code: '0',
                                                                                name: 'Kh??ng'
                                                                            }
                                                                        ] : input.name === 'is_inverter' ? [
                                                                            {
                                                                                code: '1',
                                                                                name: 'C??'
                                                                            },
                                                                            {
                                                                                code: '0',
                                                                                name: 'Kh??ng'
                                                                            }
                                                                        ] : input.name === 'type_tv' ? [
                                                                            {
                                                                                code: '1',
                                                                                name: 'Smart TV'
                                                                            },
                                                                            {
                                                                                code: '0',
                                                                                name: 'Inverter TV'
                                                                            }
                                                                        ] : input.name === 'is3D' ? [
                                                                            {
                                                                                code: "0",
                                                                                name: 'C??'
                                                                            },
                                                                            {
                                                                                code: "1",
                                                                                name: 'Kh??ng'
                                                                            }
                                                                        ] : input.name === 'ram' ? [
                                                                            {
                                                                                name: '3GB',
                                                                                code: '3GB'
                                                                            },
                                                                            {
                                                                                name: '4GB',
                                                                                code: '4GB'
                                                                            },
                                                                            {
                                                                                name: '6GB',
                                                                                code: '6GB'
                                                                            },
                                                                            {
                                                                                name: '8GB',
                                                                                code: '8GB'
                                                                            },
                                                                            {
                                                                                name: '16GB',
                                                                                code: '16GB'
                                                                            },
                                                                            {
                                                                                name: '32GB',
                                                                                code: '32GB'
                                                                            }
                                                                        ] : input.name === 'internalMemory' ? [
                                                                            {
                                                                                name: '64GB',
                                                                                code: '64GB'
                                                                            },
                                                                            {
                                                                                name: '128GB',
                                                                                code: '128GB'
                                                                            },
                                                                            {
                                                                                name: '256GB',
                                                                                code: '256GB'
                                                                            },
                                                                            {
                                                                                name: '512GB',
                                                                                code: '512GB'
                                                                            }
                                                                        ] : input.name === 'hardWare' ? [
                                                                            {
                                                                                name: 'SSD 128GB',
                                                                                code: 'SSD128GB'
                                                                            },
                                                                            {
                                                                                name: 'SSD 256GB',
                                                                                code: 'SSD256GB'
                                                                            },
                                                                            {
                                                                                name: 'SSD 512GB',
                                                                                code: 'SSD512GB'
                                                                            },
                                                                            {
                                                                                name: 'SSD 1TB',
                                                                                code: 'SSD1TB'
                                                                            },
                                                                            {
                                                                                name: 'HDD 512GB',
                                                                                code: 'HDD512GB'
                                                                            },
                                                                            {
                                                                                name: 'HDD 1TB',
                                                                                code: 'HDD1TB'
                                                                            }
                                                                        ] : input.name === 'display_resolution' ? [
                                                                            {
                                                                                name: 'Full HD',
                                                                                code: 'FHD'
                                                                            },
                                                                            {
                                                                                name: 'HD',
                                                                                code: 'HD'
                                                                            }
                                                                        ] : input.name === 'operatorSystem' ? [
                                                                            {
                                                                                name: 'Windows 10 Home',
                                                                                code: 'win10home'
                                                                            },
                                                                            {
                                                                                name: 'Windows 10 Professional',
                                                                                code: 'win10pro'
                                                                            },
                                                                            {
                                                                                name: 'Windows 10 Education',
                                                                                code: 'win10edu'
                                                                            },
                                                                            {
                                                                                name: 'Windows 10',
                                                                                code: 'win10'
                                                                            },
                                                                            {
                                                                                name: 'IOS',
                                                                                code: 'ios'
                                                                            },
                                                                            {
                                                                                name: 'Android',
                                                                                code: 'android'
                                                                            },
                                                                            {
                                                                                name: 'Mac OS',
                                                                                code: 'macos'
                                                                            }
                                                                        ] : []
                                                                    }
                                                                    required={input.required}
                                                                />
                                                            </div>
                                                        }
                                                        return <div className="col-6" key={index}>
                                                            <InputField
                                                                type={input.type}
                                                                label={input.label}
                                                                name={input.name}
                                                                value={product[`${input.name}`] || ""}
                                                                onChange={handleChange}
                                                                required={input.required}
                                                            />
                                                        </div>
                                                    })
                                                ) : ""
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="glOjBk list-cusomer-order">
                                    <h2 className="heading">
                                        Th??ng tin v???n chuy???n
                                    </h2>
                                </div>
                                <div className="card__body">
                                    <div className="row">
                                        <div className="col-12">
                                            <SelectField
                                                label="Nh?? cung c???p"
                                                value={product.supplier || ""}
                                                name="supplier"
                                                onChange={handleChange}
                                                data={data?.suppliers}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <InputField
                                                type="number"
                                                label="C??n n???ng sau khi ????ng g??i (gram)"
                                                name="weight"
                                                value={product.weight || ""}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <InputField
                                                type="number"
                                                label="Chi???u d??i (sau khi ????ng g??i)"
                                                name="length"
                                                value={product.length || ""}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <InputField
                                                type="number"
                                                label="Chi???u r???ng (sau khi ????ng g??i)"
                                                name="width"
                                                value={product.width || ""}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <InputField
                                                type="number"
                                                label="Chi???u cao (sau khi ????ng g??i)"
                                                name="height"
                                                value={product.height || ""}
                                                onChange={handleChange}
                                                // required={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="glOjBk list-cusomer-order">
                                    <h2 className="heading">
                                        H??nh ???nh s???n ph???m
                                    </h2>
                                </div>
                                <div className="card__body">
                                    <div className="row">
                                        <div className="col-12 tiny-editor-margin">
                                            <ImageUploading
                                                value={product.mainImage}
                                                onChange={onChangeUploadMainImage}
                                                maxNumber={1}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    onImageUpload,
                                                    dragProps
                                                }) => (
                                                    <div className="upload__image-wrapper">
                                                        <Button
                                                            className={classes.button}
                                                            variant="outlined"
                                                            color="primary"
                                                            component="span"
                                                            onClick={onImageUpload}
                                                            {...dragProps}
                                                            // startIcon={<FileUploadIcon />}
                                                        >
                                                            Th??m ???nh ch??nh
                                                        </Button>
                                                        {progressMainUpload > 0 ? <progress className="progress-bar" value={progressMainUpload} max="100" /> : ''}
                                                        <div className="image-wrapper">
                                                            <div className="image-wrapper-item">
                                                                {
                                                                    urlMainImage !== '' ? <img src={urlMainImage} alt="" /> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>
                                        <div className="col-12 tiny-editor-margin">
                                            <ImageUploading
                                                multiple
                                                value={product.images}
                                                onChange={onChangeUploadImage}
                                                maxNumber={maxNumber}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    onImageUpload,
                                                    dragProps
                                                }) => (
                                                    <div className="upload__image-wrapper">
                                                        <Button
                                                            className={classes.button}
                                                            variant="outlined"
                                                            color="primary"
                                                            component="span"
                                                            onClick={onImageUpload}
                                                            {...dragProps}
                                                            // startIcon={<FileUploadIcon />}
                                                        >
                                                            Th??m ???nh ph???
                                                        </Button>
                                                        {progressListUpload > 0 ? <progress className="progress-bar" value={progressListUpload} max="100" /> : ''}
                                                        <div className="image-wrapper">
                                                            {/* <button onClick={handleRemoveAllImage} className="btn-remove-all">Xo?? t???t c???</button> */}
                                                            {
                                                                urlsListImage.map((image, index) => (
                                                                    <div key={index} className="image-wrapper-item">
                                                                        <img src={image} alt="" />
                                                                        {/* <div className="overlay"></div>
                                                                        <div className="image-item__btn-wrapper">
                                                                            <button onClick={() => handleRemoveImage(image)}>
                                                                                <i className='bx bx-trash' ></i>
                                                                            </button>
                                                                        </div> */}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                        // onClick={handleSubmit}
                                        className={classes.button}
                                    >
                                        {
                                            product.id ? "C???p nh???t" : "L??u s???n ph???m"
                                        }
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                        className={classes.button}
                                        onClick={() => history.goBack()}
                                    >
                                        Quay l???i
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    </>
}

export default ProductActions;