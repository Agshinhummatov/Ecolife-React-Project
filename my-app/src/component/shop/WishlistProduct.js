import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiDelete,mdiPlus, mdiMinus } from '@mdi/js';


function WishlistProduct() {

    const url = "https://localhost:7012";
  
    let total = 0;
  
    let token = JSON.parse(localStorage.getItem("token"));
  
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };


    const [wishlists, setWishlists] = useState([]);

   //sweet alert
   const Success = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
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
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  //Get Basket from Api
  async function GetBasket() {
    await axios
      .get(`${url}/api/Wishlist/GetWishlistProducts`, config)
      .then((res) => {
        setWishlists(res.data);      
      });
      
  }
  

  useEffect(() => {
    GetBasket();
  }, []);

  

  //Delete Basket Product
  const DeleteBasket = async (id) => {
    await axios
      .delete(`${url}/api/Wishlist/DeleteWishlistProduct?id=${id}`, config)
    //   .then(function (response) {

    //     // Swal.fire("", "Deleted", "success");
    //     // axios.get(`${url}/api/Basket/Getbasketcount`, config)
    //     // .then((res) => {
    //     //   props.setbasketcount(res.data);
    //     // });
    //   })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="">Why do I have this issue?</a>',
        });
        console.log(error);
      });
     
    GetBasket();
  };




  return (


    <div>
  <div>
      <section id="table-area">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-12 d-flex align-items-center h-100">
              <div className="card border-0 w-100">
                <div className="card-header d-flex justify-content-between align-items-center bg-light pt-4">
                  <h5 className="card-title h4 mb-0 py-2">Product List</h5>
                  <Link to="/shop">
                    <button type="button" className="btn btn-secondary my-btn">
                      Add New Product
                    </button>
                  </Link>
                </div>
                <div className="card-body">
                  <table
                    id="productTable"
                    className="table table-bordered align-middle table-hover"
                  >
                    <thead className="table-color">
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price of Product</th>
                        <th>Total</th>
                        <th>Setting</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {wishlists.map((basket, i) => (
                        <tr key={i}>
                          <td>
                            <img
                              style={{
                                width: "100px",
                                height: "70px",
                                borderRadius: "unset",
                               
                              }}
                              src={`data:image/jpeg;base64,${basket.product.image}`}
                              alt=""
                            />
                          </td>
                          <td>{basket.product.name}</td>
                          {/* <td> <Icon path={mdiMinus} style={{cursor:'pointer'}}  size={1} onClick={() => DeleteItemBasket(basket.product.id)} /> {basket.quantity} <Icon path={mdiPlus} size={1} onClick={() => AddBasket(basket.product.id)} style={{cursor:'pointer'}}   /> </td>
                          <td>{(basket.product.price).toFixed(2)} $</td>
                          <td>{(basket.product.price * basket.quantity).toFixed(2)} $</td>
                          <td  style={{ display :"none" }} >
                          {(total += basket.product.price * basket.quantity )}
                          </td> */}
                          <td>
                          <Icon path={mdiDelete} size={1}  onClick={() => DeleteBasket(basket.product.id)}  style={{cursor:'pointer'}}  />
                            {/* <i
                              className="fa fa-trash-o delete-icon"
                              onClick={() => DeleteBasket(basket.product.id)}
                            ></i> */}
                          </td>
                         
                        </tr>                        
                        
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="total-price">
              <h4>Payment :</h4>
              <p>Total-Price :</p>
              <span>{total.toFixed(2)} $</span>
            </div>
          </div>
        </div>
      </section>
    </div>


    </div>
  )
}

export default WishlistProduct