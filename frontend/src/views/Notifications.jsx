import React from 'react'
import { BiTrash } from 'react-icons/bi'
import { IoIosMore } from 'react-icons/io'
import { Link } from 'react-router-dom'

function Notifications() {
  return (
    <div className="notification-wrapper">
    <div className="container-fluid">
    
      <div className="title-wrapper pt-30">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="title">
              <h2>Notifications</h2>
            </div>
          </div>
        
          <div className="col-md-6">
            <div className="breadcrumb-wrapper">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#0">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Notifications
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        
        </div>
     
      </div>
    

      <div className="card-style">
        <div className="single-notification">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-1" />
            </div>
          </div>
          <div className="notification">
            <div className="image warning-bg">
              <span>W</span>
            </div>
            <Link className="content text-decoration-none">
              <h6>Wrapped Bitcoin is now listed on Unity Exchange</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </Link>
          </div>
          <div className="action">
            <button className="delete-btn">
              <BiTrash />
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <IoIosMore />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="single-notification">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-2" />
            </div>
          </div>
          <div className="notification">
            <div className="image secondary-bg">
              <span>V</span>
            </div>
            <a href="#0" className="content">
              <h6>Vivamus tortor, odio viverra malesuada sapien dui.</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">30 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="single-notification">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image success-bg">
              <span>S</span>
            </div>
            <a href="#0" className="content">
              <h6>Srapped Citcoin is now listed on Unity Exchange</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">35 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
       
        <div className="single-notification readed">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image primary-bg">
              <span>T</span>
            </div>
            <a href="#0" className="content">
              <h6>Trapped Eitcoin is now listed on Unity Exchange</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="single-notification readed">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image info-bg">
              <span>U</span>
            </div>
            <a href="#0" className="content">
              <h6>Urapped Bitcoin is now listed on Unity Exchange</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
     
        <div className="single-notification readed">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image info-bg">
              <span>W</span>
            </div>
            <a href="#0" className="content">
              <h6>Wrapped Space is now listed on producthunt</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
       
        <div className="single-notification readed">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image warning-bg">
              <span>L</span>
            </div>
            <a href="#0" className="content">
              <h6>Lindy Uikit on trending</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="single-notification">
          <div className="checkbox">
            <div className="form-check checkbox-style mb-20">
              <input className="form-check-input" type="checkbox" value="" id="checkbox-3" />
            </div>
          </div>
          <div className="notification">
            <div className="image danger-bg">
              <span>C</span>
            </div>
            <a href="#0" className="content">
              <h6>classNameify is on sell</h6>
              <p className="text-sm text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus tortor, odio viverra malesuada sapien dui. Penatibus
                id amet lectus facilisi tincidunt at non.
              </p>
              <span className="text-sm text-medium text-gray">25 min ago</span>
            </a>
          </div>
          <div className="action">
            <button className="delete-btn">
              <i className="lni lni-trash-can"></i>
            </button>
            <button className="more-btn dropdown-toggle" id="moreAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="lni lni-more-alt"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction">
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Mark as Read</a>
              </li>
              <li className="dropdown-item">
                <a href="#0" className="text-gray">Reply</a>
              </li>
            </ul>
          </div>
        </div>
      
      </div>
    </div>
   
  </div>
  )
}

export default Notifications
