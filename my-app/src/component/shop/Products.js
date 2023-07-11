import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import Icon from '@mdi/react';
import { mdiStarOutline, mdiShoppingOutline, mdiHeartOutline, mdiEyeOutline } from '@mdi/js';
import '../../assets/css/product.css'




function Product(props) {

  let productsItem = props.Products;

  const url = "https://localhost:7012";

  const ref = useRef(null);
  const [token, setToken] = React.useState();
  //Get token of current user send backend by request header

  const navigate = useNavigate();

  const totalStars = 5;




  const [products, setProducts] = useState([]);
  const [config, setConfig] = React.useState([]);

  //paginate items start
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 6;

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("token")));
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(productsItem?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(productsItem?.length / itemsPerPage));
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

  }, [itemOffset, itemsPerPage, productsItem]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % productsItem.length;
    setItemOffset(newOffset);
  };
  //paginate items end

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


  //Add products to wishlist method
  async function AddWishlist(id) {
    try {
      if (config != null) {
        await axios.post(`${url}/api/Wishlist/AddWishlist?id=${id}`, null, config)
          .then((res) => {
            if (res.data.status === "success" || res.status === 200) {
              Success.fire({
                icon: "success",
                title: "Wishlist successfully added",
              });
              // axios.get(`${url}/api/Wishlist/Getwishlistcount`, config).then((res) => {
              //     props.setwishlistcount(res.data);
              // });
            }
          });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  }




 //Add products to basket method
 async function AddBasket(id) {
  try {
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
        });
    } else {
      navigate("/login");
    }

    ref.current?.scrollIntoView();
  } catch (error) {
    console.error(error);
  }
}


  return (

    <div>

      <div className='container'>

        <div className='row'>
          {currentItems?.map((product, i) => {
            return (
              <div className='col-lg-3 col-md-6 col-sm-6' key={i} ref={ref}>
                <div className="card-pr" cart-id="1">

                  <div className="imagesBx">

                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt=""
                    />


                    <img className='rear-img'  src={`data:image/jpeg;base64,${product.hoverImage}`}
                      alt=""  />

                    <ul className="icon-shop">

                    <li onClick={() => AddWishlist(product.id)}>
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
                    <Link style={{ fontSize: "15px", color: "#999999" }} href="">{product.categoryName}</Link>
                    <h4 style={{ fontSize: "20px" }} className="mt-1">{product.name} </h4>

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
                   
                  </div>

                </div>

              </div>
            );
          })}
          {/* <div className='col-lg-3 col-md-6 col-sm-6'>
            <div className="card-pr" cart-id="1">

              <div className="imagesBx">
                <img src={product1} alt="images" />

                <img className='rear-img' src={product2} alt="images" />
                <ul className="icon-shop">
                  <li>
                    <Icon path={mdiHeartOutline} size={1} />
                    <span>Add to WishList</span>
                  </li>
                  <li>
                    <Icon path={mdiShoppingOutline} size={1} />
                    <span>Add to Cart</span>

                  </li>

                  <Link className="detail" href="product-detail.html">
                    <li>
                      <Icon path={mdiEyeOutline} size={1} color="black" />
                      <span>View Details</span>
                    </li>
                  </Link>

                </ul>
              </div>

              <div className="productName">
                <h4>Manufacturer </h4>
                <Link href="">Almond Protein Superfoods</Link>
              </div>
              <div className="star text-center mt-3">
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
              </div>
              <div className="price text-center mt-3">
                <span>25$</span>
                <span><del>35$</del></span>
              </div>

            </div>

          </div>

          <div className='col-lg-3 col-md-6 col-sm-6'>
            <div className="card-pr" cart-id="1">

              <div className="imagesBx">
                <img src={product1} alt="images" />

                <img className='rear-img' src={product2} alt="images" />
                <ul className="icon-shop">
                  <li>
                    <Icon path={mdiHeartOutline} size={1} />
                    <span>Add to WishList</span>
                  </li>
                  <li>
                    <Icon path={mdiShoppingOutline} size={1} />
                    <span>Add to Cart</span>

                  </li>

                  <Link className="detail" href="product-detail.html">
                    <li>
                      <Icon path={mdiEyeOutline} size={1} color="black" />
                      <span>View Details</span>
                    </li>
                  </Link>

                </ul>
              </div>

              <div className="productName">
                <h4>Manufacturer </h4>
                <Link href="">Almond Protein Superfoods</Link>
              </div>
              <div className="star text-center mt-3">
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
              </div>
              <div className="price text-center mt-3">
                <span>25$</span>
                <span><del>35$</del></span>
              </div>

            </div>

          </div>

          <div className='col-lg-3 col-md-6 col-sm-6'>
            <div className="card-pr" cart-id="1">

              <div className="imagesBx">
                <img src={product1} alt="images" />

                <img className='rear-img' src={product2} alt="images" />
                <ul className="icon-shop">
                  <li>
                    <Icon path={mdiHeartOutline} size={1} />
                    <span>Add to WishList</span>
                  </li>
                  <li>
                    <Icon path={mdiShoppingOutline} size={1} />
                    <span>Add to Cart</span>

                  </li>

                  <Link className="detail" href="product-detail.html">
                    <li>
                      <Icon path={mdiEyeOutline} size={1} color="black" />
                      <span>View Details</span>
                    </li>
                  </Link>

                </ul>
              </div>

              <div className="productName">
                <h4>Manufacturer </h4>
                <Link href="">Almond Protein Superfoods</Link>
              </div>
              <div className="star text-center mt-3">
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
                <Icon path={mdiStarOutline} size={1} color="gold" />
              </div>
              <div className="price text-center mt-3">
                <span>25$</span>
                <span><del>35$</del></span>
              </div>

            </div>

          </div> */}




        </div>



        <ReactPaginate
          breakLabel="..."
          nextLabel="next>"
          onPageChange={handlePageClick}
          marginPagesDisplayed={0}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="<previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="active"
        />




      </div>


    </div>
  )
}

export default Product