
const CustomButton = (props) => {
  const { onClick, title } = {...props};

  return (
    <button className="custom-button" onClick={onClick}>
      <span className="button-container">
        <span className="button-container ">
          <img alt="" aria-hidden="true" src="./button-background.svg" className="button-img-background" />
        </span>
        <img alt="" src="./button.svg" className="button-img" />
      </span>
      <div className="button-title-container">
        <div className="button-title">{title}</div>
      </div>
    </button>
  )
}

export default CustomButton;