import React from 'react'
import "../../assets/css/blog.css"
import blogImageOne from '../../assets/img/blog1.jpg'
import blogImageTwo from '../../assets/img/blog2.jpg'
import blogImageThree from '../../assets/img/blog3.jpg'


function Blog() {
    return (
        <div>

            <section>

                <div className='container'>
                    <div className='row'>
                        <div className='col-4 mt-5'>
                            <div class="blog-item">
                                <div class="blog-content">
                                    <div className='blog-img'> 

                                        <img src={blogImageOne} alt="" />

                                    </div>
                                    <h2 class="blog-title">
                                        <a href="blog.html">The Moment You Need To Remove Garlic </a>
                                    </h2>
                                    <div class="blog-meta">
                                       <p>11/06/2023</p>
                                    </div>
                                    <p class="blog-desc ">
                                        Lorem ipsum dolor sit amet, consecteturl adipisl elit,
                                        sed do eiusmod tempor incidio ut labore et dolore
                                        magna aliqua.
                                    </p>
                                   
                                </div>
                               
                            </div>
                        </div>

                        <div className='col-4 mt-5'>
                            <div class="blog-item">
                                <div class="blog-content">
                                    <div className='blog-img'> 

                                        <img src={blogImageTwo} alt="" />

                                    </div>
                                    <h2 class="blog-title">
                                        <a href="blog.html">The Moment You Need To Remove Garlic </a>
                                    </h2>
                                    <div class="blog-meta">
                                       <p>11/06/2023</p>
                                    </div>
                                    <p class="blog-desc ">
                                        Lorem ipsum dolor sit amet, consecteturl adipisl elit,
                                        sed do eiusmod tempor incidio ut labore et dolore
                                        magna aliqua.
                                    </p>
                                </div>
                               
                            </div>
                        </div>

                        <div className='col-4 mt-5'>
                            <div class="blog-item">
                                <div class="blog-content">
                                    <div className='blog-img'> 

                                        <img src={blogImageOne} alt="" />

                                    </div>
                                    <h2 class="blog-title">
                                        <a href="blog.html">The Moment You Need To Remove Garlic </a>
                                    </h2>
                                    <div class="blog-meta">
                                       <p>11/06/2023</p>
                                    </div>
                                    <p class="blog-desc ">
                                        Lorem ipsum dolor sit amet, consecteturl adipisl elit,
                                        sed do eiusmod tempor incidio ut labore et dolore
                                        magna aliqua.
                                    </p>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Blog