// Write your code here
import './index.css'

const ProductCard = props => {
  const {itemDetails} = props
  const {title, brand, imageUrl, rating, price} = itemDetails

  return (
    //   Wrap with Link from react-router-dom
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-thumbnail"
      />
      <h1 className="title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default ProductCard
