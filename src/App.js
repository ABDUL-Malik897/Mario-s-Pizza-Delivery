import { useEffect, useState } from "react"
import "./App.css"


function App() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    isDelivery: true
  })

  const [pizzaOrder, setPizzaOrder] = useState({
    size: "medium",
    crust: "regular",
    quantity: 1,
    toppings: [],
    sides: [],
    specialInstructions: ""
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderConfirm, setOrderConfirm] = useState(null)

  useEffect(() => {
    const savedOrder = localStorage.getItem("marioLastOrder")

    if (savedOrder) {
      setOrderConfirm(JSON.parse(savedOrder))
    }
  }, [])

  const sizePrices = {
    small: 12.99,
    medium: 15.99,
    large: 18.99,
  }

  const crustPrices = {
    regular: 0,
    thin: 1,
    thick: 2,
    stuffed: 3
  }

  const toppings = [
    "pepperoni",
    "sausage",
    "mushrooms",
    "green peppers",
    "onions",
    "black olives",
    "extra cheese",
    "bacon",
    "pineapple",
    "jalapenos",
    "tomatoes"
  ]

  const sides = [
    { name: "Coke", price: 2.00 },
    { name: "Pepsi", price: 2.00 },
    { name: "Sprite", price: 2.00 },
    { name: "Garlic Dip", price: 1.00 },
    { name: "Cheese Dip", price: 1.50 }
  ]

  const calculateTotal = () => {
    let total = (sizePrices[pizzaOrder.size] + crustPrices[pizzaOrder.crust]) * pizzaOrder.quantity
    total += pizzaOrder.toppings.length * 1.5
    pizzaOrder.sides.forEach(side => {
      total += side.price
    })
    if (customerInfo.isDelivery) {
      total += 2.99
    }
    return total.toFixed(2)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!customerInfo.name.trim()) {
      newErrors.name = "Name is required"
    } else if (customerInfo.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(customerInfo.phone)) {
      newErrors.phone = "Phone number must contain 10 digits"
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
    ) {
      newErrors.email = "Please enter a valid email address"
    }
    if (customerInfo.isDelivery && !customerInfo.address.trim()) {
      newErrors.address = "Delivery address is required"
    }
    if (pizzaOrder.toppings.length === 0) {
      newErrors.toppings = "Please select at least one topping"
    }
    return newErrors
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    })
    setErrors({
      ...errors,
      [name]: ""
    })
  }

  const handleDelivery = (isDelivery) => {
    setCustomerInfo({
      ...customerInfo,
      isDelivery
    })
    setErrors({
      ...errors,
      address: ""
    })
  }

  const handleToppings = (topping) => {
    let newToppings
    if (pizzaOrder.toppings.includes(topping)) {
      newToppings = pizzaOrder.toppings.filter(
        item => item !== topping
      )
    } else {
      newToppings = [
        ...pizzaOrder.toppings,
        topping
      ]
    }
    setPizzaOrder({
      ...pizzaOrder,
      toppings: newToppings
    })
    setErrors({
      ...errors,
      toppings: ""
    })
  }

  const handleSides = (side) => {
    const alreadySelected = pizzaOrder.sides.some(item => item.name === side.name)
    let newSides
    if (alreadySelected) {
      newSides = pizzaOrder.sides.filter(item => item.name !== side.name)
    } else {
      newSides = [
        ...pizzaOrder.sides,
        side
      ]
    }
    setPizzaOrder({
      ...pizzaOrder,
      sides: newSides
    })
  }

  const resetOrder = () => {
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      isDelivery: true
    })
    setPizzaOrder({
      size: "medium",
      crust: "regular",
      quantity: 1,
      toppings: [],
      sides: [],
      specialInstructions: ""
    })
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      const order = {
        customer: customerInfo,
        pizza: pizzaOrder,
        total: calculateTotal()
      }
      localStorage.setItem("marioLastOrder", JSON.stringify(order))
      setOrderConfirm(order)
      setIsSubmitting(false)
      resetOrder()
    }, 1000)
  }

  return (
    <div className="App">
      <header>
        <h1>Mario's Pizza - Online Ordering</h1>
        <p>Authentic Brooklyn Pizza Since 1952</p>
      </header>
      <main>
        <form
          className="pizza-order-form"
          onSubmit={handleSubmit}
        >
          <h2>Place Your Order</h2>
          <section>
            <h3>Customer Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={customerInfo.name}
                onChange={handleInput}
                placeholder="Enter your full name"
                className={errors.name ? "error" : ""}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <span className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={handleInput}
                placeholder="Enter 10 digit phone number"
                maxLength="10"
                className={errors.phone ? "error" : ""}
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <span className="error-message" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleInput}
                placeholder="your.email@example.com"
                className={errors.email ? "error" : ""}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <span className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
            {customerInfo.isDelivery && (
              <div className="form-group">
                <label htmlFor="address">
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInput}
                  placeholder="Enter your delivery address"
                  rows="3"
                  className={errors.address ? "error" : ""}
                  aria-invalid={errors.address ? "true" : "false"}
                />

                {errors.address && (
                  <span className="error-message" role="alert">
                    {errors.address}
                  </span>
                )}
              </div>
            )}
            <fieldset>
              <legend>Order Type</legend>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={customerInfo.isDelivery}
                    onChange={() => handleDelivery(true)
                    }
                  />
                  Delivery (45-60 minutes)
                </label>
                <label>
                  <input
                    type="radio"
                    checked={!customerInfo.isDelivery}
                    onChange={() => handleDelivery(false)
                    }
                  />
                  Pickup (20-30 minutes)
                </label>
              </div>
            </fieldset>
          </section>
          <section>
            <h3>Build Your Pizza</h3>
            <div className="form-group">
              <label htmlFor="size">
                Pizza Size
              </label>
              <select
                id="size"
                value={pizzaOrder.size}
                onChange={e => setPizzaOrder({
                  ...pizzaOrder,
                  size: e.target.value
                })}
              >
                <option value="small">
                  Small - $12.99
                </option>
                <option value="medium">
                  Medium - $15.99
                </option>
                <option value="large">
                  Large - $18.99
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="crust">
                Crust Type
              </label>
              <select
                id="crust"
                value={pizzaOrder.crust}
                onChange={e => setPizzaOrder({
                  ...pizzaOrder,
                  crust: e.target.value
                })}
              >
                <option value="regular">
                  Regular Crust
                </option>
                <option value="thin">
                  Thin Crust (+$1.00)
                </option>
                <option value="thick">
                  Thick Crust (+$2.00)
                </option>
                <option value="stuffed">
                  Stuffed Crust (+$3.00)
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() =>
                    setPizzaOrder({
                      ...pizzaOrder,
                      quantity: Math.max(1, pizzaOrder.quantity - 1)
                    })
                  }
                >
                  -
                </button>
                <span>
                  {pizzaOrder.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPizzaOrder({
                      ...pizzaOrder,
                      quantity: pizzaOrder.quantity + 1
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
            <fieldset>
              <legend>
                Toppings ($1.50 each)
              </legend>
              <div className="toppings-grid">
                {toppings.map(topping => (
                  <label
                    key={topping}
                    className="toppings-option"
                  >
                    <input
                      type="checkbox"
                      checked={pizzaOrder.toppings.includes(topping)}
                      onChange={() => handleToppings(topping)}
                    />
                    {topping}
                  </label>
                ))}
              </div>
              {errors.toppings && (
                <span className="error-message" role="alert">
                  {errors.toppings}
                </span>
              )}
            </fieldset>
            <fieldset>
              <legend>Sides & Drinks</legend>
              <div className="toppings-grid">
                {sides.map(side => (
                  <label
                    key={side.name}
                    className="toppings-option"
                  >
                    <input
                      type="checkbox"
                      checked={pizzaOrder.sides.some(item => item.name === side.name)}
                      onChange={() => handleSides(side)
                      }
                    />
                    {side.name} (+$
                    {side.price.toFixed(2)})
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="form-group">
              <label htmlFor="instructions">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                value={pizzaOrder.specialInstructions}
                onChange={e => setPizzaOrder({
                  ...pizzaOrder,
                  specialInstructions: e.target.value
                })}
                placeholder="Any special requests?"
                rows="3"
                maxLength="200"
              />
              <small className="character-count">
                {
                  pizzaOrder.specialInstructions.length
                }
                /200 characters
              </small>
            </div>
          </section>
          <section className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span className="item-name">
                {pizzaOrder.size} Pizza
                <br />
                {pizzaOrder.crust} Crust
                <br />
                Quantity: {pizzaOrder.quantity}
              </span>
              <span className="item-price">
                ${((sizePrices[pizzaOrder.size] + crustPrices[pizzaOrder.crust]) * pizzaOrder.quantity).toFixed(2)}
              </span>
            </div>
            {pizzaOrder.toppings.length > 0 && (
              <div className="summary-item">
                <span className="item-name">
                  Toppings:{" "}
                  {pizzaOrder.toppings.join(", ")}
                </span>
                <span className="item-price">
                  $
                  {(pizzaOrder.toppings.length * 1.5).toFixed(2)}
                </span>
              </div>
            )}
            {pizzaOrder.sides.length > 0 && (
              <div className="summary-item">
                <span className="item-name">
                  Sides:{" "}
                  {pizzaOrder.sides.map(side => side.name).join(", ")}
                </span>
                <span className="item-price">
                  ${pizzaOrder.sides.reduce((total, side) =>  total + side.price,0).toFixed(2)}
                </span>
              </div>
            )}
            {customerInfo.isDelivery && (
              <div className="summary-item">
                <span className="item-name">
                  Delivery Fee
                </span>
                <span className="item-price">
                  $2.99
                </span>
              </div>
            )}
            <div className="summary-total">
              <span className="total-label">
                Total:
              </span>
              <span className="total-price">
                ${calculateTotal()}
              </span>
            </div>
            {customerInfo.name && (
              <div className="customer-detail">
                <p>
                  <strong>Customer:</strong>{" "}
                  {customerInfo.name}
                </p>
                {customerInfo.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    {customerInfo.phone}
                  </p>
                )}
                {customerInfo.isDelivery ? (
                  <p>
                    <strong>Delivery to:</strong>{" "}
                    {customerInfo.address ||
                      "Address needed"}
                  </p>
                ) : (
                  <p>
                    <strong>Pickup:</strong>{" "}
                    Mario's Pizza
                  </p>
                )}
              </div>
            )}
          </section>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing Order..."
              : `Place Order - $${calculateTotal()}`}
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={resetOrder}
          >
            Clear Order
          </button>
        </form>
        {orderConfirm && (
          <div className="order-confirmation">
            <h2>Order Confirmed!</h2>
            <p>
              Thank you,{" "}
              {orderConfirm.customer.name}!
            </p>
            <div className="receipt">
              <h3>Mario's Pizza</h3>
              <p>
                {orderConfirm.pizza.size} Pizza
              </p>
              <p>
                Crust:{" "}
                {orderConfirm.pizza.crust}
              </p>
              <p>
                Quantity:{" "}
                {orderConfirm.pizza.quantity}
              </p>
              {orderConfirm.pizza.toppings.length >
                0 && (
                <p>
                  Toppings:{" "}
                  {orderConfirm.pizza.toppings.join(
                    ", "
                  )}
                </p>
              )}
              {orderConfirm.pizza.sides.length >
                0 && (
                <p>
                  Sides:{" "}
                  {orderConfirm.pizza.sides
                    .map(side => side.name)
                    .join(", ")}
                </p>
              )}
              <hr />
              <h3>
                Total: ${orderConfirm.total}
              </h3>
            </div>
            <button
              type="button"
              className="new-order-btn"
              onClick={() =>
                setOrderConfirm(null)
              }
            >
              Place Another Order
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

