import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import payment from '../../assets/img/payment.png'
import Icon from '@mdi/react';
import { mdiStarOutline, mdiPlus, mdiMinus, mdiDelete } from '@mdi/js';
import { useNavigate } from "react-router";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


// import ReactPaginate from "react-paginate";
// import { Carousel } from "react-carousel-minimal";




function ProductDetail(props) {

    const id = props.id;



    const url = "https://localhost:7012";

    const ref = useRef(null);

    const navigate = useNavigate();



    const [token, setToken] = React.useState();

    const [config, setConfig] = React.useState([]);

    const [baskets, setBaskets] = useState([]);

    const [comment, setComment] = useState([]);

    const [context, setContext] = useState('');

    const [userName, setUsername] = useState('');



    const [basketItemCount, setBasketItemCount] = useState(0);

    const [inputValue, setInputValue] = useState("1");


    //Get currents users name from token
    let currentToken = localStorage.getItem("token");
    let currentUser;
    if (currentToken != null) {
        function parseJwt(token) {
            var base64Url = token.split(".")[1];
            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join("")
            );
            return JSON.parse(jsonPayload);
        }
        currentUser =
            parseJwt(currentToken)[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];
    }





    const getById = async (id) => {
        try {
            const response = await axios.get(`${url}/api/ProdcutComment/GetById/${id}`);
            setComment(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    window.location.href = '/404';
                } else if (error.response.status === 400) {
                    window.location.href = '/400';
                }
            } else {
                console.error(error);
            }
        }
    };





    const newComment = {
        userName: currentUser,
        context: context,
        PordicutId: id,
    };




    //Create Comment
    const CreateComment = async (e) => {
        e.preventDefault();

        // if (title.trim() === '') {
        //     setIsTitleEmpty(true);
        //     return;
        // }

        // if (description.trim() === '') {
        //     setIsDescriptionEmpty(true);
        //     return;
        // }

        const formData = new FormData();
        for (const [key, value] of Object.entries(newComment)) {
            formData.append(key, value);
        };

        await axios.post(`${url}/api/ProdcutComment/Create`, formData, config, {
            headers: {
                Accept: "*/*"
            }
        })
            .then((res) => {
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Comment Created',
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(res);
                // Reset the input field after creating the comment
                // Reset the input field after creating the comment
                e.target.reset();

            })
            .catch((err) => {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Comment not Created',
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(err);

            });


    };














    //rating method
    const totalStars = 5;
    const rates = props?.product?.rates || 0;
    const remainingStars = totalStars - rates;

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
        getById(id)
        getBasketItemCount(id);
        // AddBasket(id);
    }, [token, config, id]);





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


    const handleAddBasket = async (id) => {
        if (props.product.count - basketItemCount < 1) {
            // Stok sayısı 1'den az ise uyarı mesajı göster
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "There are no products in stock!",

            });
            return;
        }

        if (config != null) {
            try {
                const response = await axios.post(`${url}/api/Basket/AddBasket?id=${id}`, null, config);
                if (response.data.status === "success" || response.status === 200) {
                    Success.fire({
                        icon: "success",
                        title: "Product successfully added",
                    });
                    axios.get(`${url}/api/Basket/Getbasketcount`, config).then((res) => {
                        props.setbasketcount(res.data);
                    });
                }
            } catch (error) {
                console.error("Hata:", error);
            }
        } else {
            navigate("/login");
        }
    };







    //Get Sweet Alert from session storage after refresh
    if (sessionStorage.getItem("sweetAlertMessage")) {
        Success.fire({
            text: sessionStorage.getItem("sweetAlertMessage"),
            icon: "success",
            timer: 2000,
        });
        sessionStorage.removeItem("sweetAlertMessage");
    }


    //Get Basket Item Count
    const getBasketItemCount = async (id) => {
        try {
            const response = await axios.get(`${url}/api/Basket/GetBasketItemCount/${id}`, config);
            const itemCount = response.data;
            setBasketItemCount(itemCount);
            setInputValue(String(itemCount));
        } catch (error) {
            console.error('Hata:', error);
        }
    };









    //Deletes basketProduct from the API.
    const DeleteItemBasket = async (id) => {
        await axios
            .delete(`${url}/api/Basket/DeleteBasketItemProduct?id=${id}`, config)
            .then(function (response) {

                // Swal.fire("", "Deleted", "success");
                axios.get(`${url}/api/Basket/Getbasketcount`, config)
                    .then((res) => {
                        props.setbasketcount(res.data);
                    });
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="">Why do I have this issue?</a>',
                });
                console.log(error);
            });


    };



    //Deletes an Comment from the API.
    const DeleteComment = async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
            params: {
                userName: currentUser,
            },
        };

        try {
            const response = await axios.delete(
                `${url}/api/ProdcutComment/Delete/${id}`,
                config
            );
            Swal.fire("", "Deleted Comment", "success");
            console.log(response);
            getById(id);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
            console.log(error);
        }
    };



    //Get Basket from Api
    //   async function GetBasket() {
    //     await axios
    //       .get(`${url}/api/Basket/GetBasketProducts`, config)
    //       .then((res) => {
    //         setBaskets(res.data);      
    //       });
    //   }




    // const data = [
    //     {
    //         image: product1,

    //     },
    //     {
    //         image: product2,

    //     },
    //     {
    //         image: product3,

    //     },
    //     {
    //         image: product4,

    //     }

    // ];


    // const captionStyle = {
    //     fontSize: '2em',
    //     fontWeight: 'bold',
    // }
    // const slideNumberStyle = {
    //     fontSize: '20px',
    //     fontWeight: 'bold',
    // }




    return (
        <div>


            <div className='d-flex mt-5'>
                <div className='col-6'>
                    <div className="App">
                        {/* <div style={{ textAlign: "center" }}>

                            <div style={{
                                padding: "0 20px"
                            }}>
                                <Carousel
                                    data={data}
                                    time={2000}
                                    width="850px"
                                    height="500px"
                                    captionStyle={captionStyle}
                                    radius="10px"
                                    slideNumber={true}
                                    slideNumberStyle={slideNumberStyle}
                                    captionPosition="bottom"
                                    automatic={true}
                                    dots={true}
                                    pauseIconColor="white"
                                    pauseIconSize="40px"
                                    slideBackgroundColor="darkgrey"
                                    slideImageFit="cover"
                                    thumbnails={true}
                                    thumbnailWidth="100px"
                                    style={{
                                        textAlign: "center",
                                        maxWidth: "850px",
                                        maxHeight: "500px",
                                        margin: "40px auto",
                                    }}
                                />
                            </div>
                        </div> */}
                    </div>

                </div>

                <div className="col-6">

                    <div className="product-info">


                        <h1>{props?.product.name}</h1>


                        <div className="star">

                            {Array(props?.product.rates).fill().map((_, i) => (
                                <Icon key={i} path={mdiStarOutline} size={1} color="gold" />
                            ))}

                            {Array(remainingStars).fill().map((_, i) => (
                                <Icon key={i} path={mdiStarOutline} size={1} color="grey" />
                            ))}
                        </div>


                        <div className="sale-text mt-3">

                            <div className="sale"><span >$160.00</span> </div>

                            <div className="sale-info"><span>50% Off</span></div>

                        </div>



                        <h3>${props?.product.price}</h3>
                        <div className="line-text">

                            <span>{props?.product.description}</span>

                        </div>



                        <div className="stock">

                            <h6>Avalibility: In Stock : <span></span>{props?.product.count - basketItemCount}</h6>
                            <h6></h6>
                        </div>


                        <div className="number">
                            <Icon path={mdiMinus} style={{ cursor: 'pointer' }} size={1} onClick={() => DeleteItemBasket(id)} />

                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

                            <Icon path={mdiPlus} size={1} onClick={() => handleAddBasket(props.id)} style={{ cursor: 'pointer' }} />

                        </div>


                        <div className="button-buy gap">

                            <button type="button" className="btn ">ADD TO CARD</button>

                            <button type="button" className="btn   buy-now" onClick={() => handleAddBasket(props.id)}>BUY NOW</button>


                        </div>

                        <div className='pro-payment mt-5'>
                            <img src={payment} alt="" />

                        </div>

                    </div>

                </div>

            </div>
            <div className='col-12 mt-5'>

                <Tabs
                    defaultActiveKey="profile"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                >
                    <Tab className='tab-desc' eventKey="Description" title="Description">

                        <p> Stock up on the perfect afternoon snack, lunchtime side or baking choice with a Three-Pound Bag of Honeycrisp Apples from Good & Gather™. Boasting the perfect blend of sweet and crisp flavors, these delicious Honeycrisp apples promise to hit the spot when you’re craving something fresh and tasty, and the crisp, juicy texture is sure to satisfy.
                            Every product that carrie</p>

                        <h2>Item Specifics</h2>

                        <ul className='mt-5'>

                            <li>
                                <h4></h4>: Thailand
                            </li>
                            <li>
                                Packing: 400g pack
                            </li>
                            <li>
                                Packing: 400g pack
                            </li>
                            <li>
                                Origin: Thailand
                            </li>
                            <li>
                                Origin: Thailand
                            </li>
                        </ul>

                    </Tab>
                    <Tab eventKey="PRODUCT DETAILS" title="PRODUCT DETAILS">


                    </Tab>
                    <Tab eventKey="longer-tab" title="Loooonger Tab">



                        <div class="container mt-5">

                            <div class="row  d-flex justify-content-center">

                                <div class="col-md-8">

                                    <div class="headings d-flex justify-content-between align-items-center mb-3">
                                        <h5>Unread comments(6)</h5>

                                        <div class="buttons">

                                            <span class="badge bg-white d-flex flex-row align-items-center">
                                                <span class="text-primary">Comments "ON"</span>
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked />

                                                </div>
                                            </span>

                                        </div>

                                    </div>



                                    {
                                        comment.map((comment, index) => (
                                            <div key={index} class="card comment p-3 mt-3">

                                                <div class="d-flex justify-content-between align-items-center">

                                                    <div class="user d-flex flex-row align-items-center">


                                                        <span><small class="font-weight-bold text-primary comment-contex" >{comment.userName}</small> <small class="font-weight-bold" >{comment.context}</small></span>

                                                    </div>


                                                    <small>{comment.createdTime}</small>

                                                </div>


                                                <div class="action d-flex justify-content-between mt-2 align-items-center">

                                                    <div class="reply px-4">







                                                    </div>

                                                    <div class="icons align-items-center">


                                                        <Icon path={mdiDelete} size={1} style={{ cursor: "pointer" }} color="red" onClick={() => DeleteComment(comment.productCommentId)} />

                                                    </div>

                                                </div>



                                            </div>
                                        ))
                                    }









                                    <Form onSubmit={(e) => CreateComment(e)}>


                                        <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Add Comment</Form.Label>
                                            <Form.Control
                                                style={{ outline: 'none' }}
                                                type="text"
                                                as="textarea"
                                                rows={3}
                                                placeholder="Enter Comment"
                                                required
                                                onFocus={(e) => e.target.placeholder = ''}
                                                onBlur={(e) => e.target.placeholder = 'Enter Comment'}
                                                onChange={(e) => setContext(e.target.value)}
                                            />
                                        </Form.Group>




                                        <Button variant="outline-primary" type="submit">
                                            Send
                                        </Button>
                
                                    </Form>




                                </div>





                            </div>

                        </div>



                    </Tab>

                </Tabs>


            </div>


        </div>
    )
}

export default ProductDetail