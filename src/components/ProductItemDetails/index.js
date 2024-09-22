// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    productItemDetails: {},
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormattedData = product => ({
    title: product.title,
    style: product.style,
    brand: product.brand,
    price: product.price,
    description: product.description,
    totalReviews: product.total_reviews,
    id: product.id,
    imageUrl: product.image_url,
    rating: product.rating,
    availability: product.availability,
  })

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const formattedData = {
        productItem: this.getFormattedData(fetchedData),
        similarProducts: fetchedData.similar_products.map(eachSimilarProduct =>
          this.getFormattedData(eachSimilarProduct),
        ),
      }
      this.setState({
        productItemDetails: formattedData.productItem,
        apiStatus: apiStatusConstants.success,
        similarProductsList: formattedData.similarProducts,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onClickDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderProductItemDetailsView = () => {
    const {count, productItemDetails, similarProductsList} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItemDetails

    return (
      <div className="product-item-details-container">
        <Header />
        <div className="product-item-details-top-section-container">
          <img alt="product" className="product-item-image" src={imageUrl} />
          <div className="details-container">
            <h1 className="product-item-title">{title} </h1>
            <p className="product-item-price"> {price} </p>
            <div className="review-rating-card">
              <div className="rating-card">
                <p>{rating} </p>
                <img
                  alt="star"
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="reviews"> {totalReviews} reviews </p>
            </div>
            <p className="text">{description}</p>
            <div className="flex-container">
              <p className="option"> Available:</p>
              <p className="text"> {availability} </p>
            </div>
            <div className="flex-container">
              <p className="option"> Brand:</p>
              <p className="text"> {brand} </p>
            </div>
            <div className="count-container">
              <button
                data-testid="minus"
                className="inc-dec-button"
                type="button"
                onClick={this.onClickDecrease}
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="count">{count} </p>
              <button
                data-testid="plus"
                className="inc-dec-button"
                type="button"
                onClick={this.onClickIncrease}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button
              className="add-button"
              type="button"
              onClick={this.onClickAdd}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="product-item-details-bottom-section-container">
          <h1 className="similar-products-text">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProductsList.map(eachItem => (
              <SimilarProductItem key={eachItem.id} itemDetails={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="product-item-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <button
        onClick={this.onClickContinue}
        type="button"
        className="continue-shopping-btn"
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
