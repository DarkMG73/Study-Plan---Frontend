import styles from "./Card.module.css";
const Card = (props) => {
  return (
    <div
      id={"-card" + props.elmID}
      className={styles.header}
      style={props.styles}
      data-elmtype="card"
      data-cardtype="card"
      data-identifier={props.identifier}
    >
      {props.children}
    </div>
  );
};

export default Card;
