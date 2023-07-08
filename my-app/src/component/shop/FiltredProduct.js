import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import Icon from '@mdi/react';
import { mdiStarOutline, mdiShoppingOutline, mdiHeartOutline, mdiEyeOutline } from '@mdi/js';
import '../../assets/css/product.css'

function FiltredProduct(props) {

    const url = "https://localhost:7012";

    const ref = useRef(null);
    const [token, setToken] = React.useState();
    //Get token of current user send backend by request header

    const navigate = useNavigate();
    const totalStars = 5;
    const [products, setProducts] = useState([]);

    const [wishlist, setWishlist] = useState([]);
    const [config, setConfig] = React.useState([]);


    useEffect(() => {
        setToken(JSON.parse(localStorage.getItem("token")));

        if (token) {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            }
            setConfig(config);
        }
        else {
            const config = null;
            setConfig(config);
        }

    }, [products]);



    //sweet alert
    const Success = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2400,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
    const Reject = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2400,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    //Get Products from Api
    async function GetProducts() {
        await axios.get(`${url}/api/Product/GetAll`).then((res) => {
            setProducts(res.data);
        });
    }





    useEffect(() => {
        GetProducts();
    }, []);



    async function AddBasket(id) {
        if (config != null) {
            await axios
                .post(`${url}/api/Basket/AddBasket?id=${id}`, null, config)
                .then((res) => {
                    if (res.data.status === "success" || res.status === 200) {
                        Success.fire({
                            icon: "success",
                            title: "Product successfully added",
                        });
                        axios.get(`${url}/api/Basket/Getbasketcount`, config).then((res) => {
                            props.setbasketcount(res.data);
                        });
                    }
                })

        } else { navigate("/login"); }




    }




    async function AddWishlsit(id) {
        if (config != null) {
            await axios
                .post(`${url}/api/Wishlist/AddWishlist?id=${id}`, null, config)
                .then((res) => {
                    if (res.data.status === "success" || res.status === 200) {
                        Success.fire({
                            icon: "success",
                            title: "Wishlsit successfully added",
                        });
                        // axios.get(`${url}/api/Wishlist/Getwishlistcount`, config).then((res) => {
                        //     props.setwishlistcount(res.data);
                        // });
                    }
                })

        } else { navigate("/login"); }




    }

    return (
        <div>

            <div className='container'>

                <div className='row'>
                    {products?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((product, i) => {
                        return (
                            <div className='col-lg-3 col-md-6 col-sm-6' key={i} ref={ref}>
                                <div className="card-pr" cart-id="1">

                                    <div className="imagesBx">

                                        <img
                                            src={`data:image/jpeg;base64,${product.image}`}
                                            alt=""
                                        />


                                        <img className='rear-img' src={`data:image/jpeg;base64,${product.hoverImage}`}
                                            alt="" />

                                        <ul className="icon-shop">
                                            <li onClick={() => AddWishlsit(product.id)}> 
                                                <Icon path={mdiHeartOutline} size={1} />
                                                <span>Add to WishList</span>
                                            </li>
                                            <li onClick={() => AddBasket(product.id)}>
                                                <Icon path={mdiShoppingOutline} size={1} />
                                                <span >Add to Cart</span>

                                            </li>

                                            <NavLink className="detail" to={`/productDetail/${product.id}`}>
                                                <li>
                                                    <Icon path={mdiEyeOutline} size={1} color="black" />
                                                    <span>View Details</span>
                                                </li>
                                            </NavLink>

                                        </ul>
                                    </div>

                                    <div className="productName">
                                        <h4>{product.categoryName} </h4>
                                        <Link href="">{product.name}</Link>
                                    </div>


                                    <div className="star text-center mt-3" >

                                        {Array(product.rates).fill().map((_, i) => (
                                            <Icon key={i} path={mdiStarOutline} size={1} color="gold" />
                                        ))}

                                        {Array(totalStars - product.rates).fill().map((_, i) => (
                                            <Icon key={i} path={mdiStarOutline} size={1} color="grey" />
                                        ))}


                                    </div>

                                    <div className="price text-center mt-3">
                                        <span>{product.price}$</span>
                                        <span><del>35$</del></span>
                                    </div>

                                </div>

                            </div>
                        );
                    })}
                    



                </div>



              




            </div>


        </div>
    )
}

export default FiltredProduct