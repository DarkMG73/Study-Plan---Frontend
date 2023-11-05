import syles from "./PushButton.module.css";
import React, { Fragment } from "react";

function PushButton(props) {
  const {
    inputOrButton,
    children,
    name,
    label,
    type,
    colorType,
    size,
    active,
    selected,
    styles,
    identifier,
    value,
    data,
    onClick,
    ...otherProps
  } = props;
  let output;
  if (inputOrButton === "button") {
    output = (
      <Fragment>
        <button
          className={
            syles["button"] +
            " " +
            syles[colorType] +
            " " +
            syles[size] +
            " " +
            syles[active] +
            " " +
            syles[selected]
          }
          style={styles}
          id={identifier}
          value={value}
          data-data={data}
          onClick={onClick}
          {...otherProps}
        >
          {children}
        </button>
      </Fragment>
    );
  } else {
    output = (
      <Fragment>
        <label htmlFor={name}>{label}</label>
        <input
          key={name}
          id={identifier}
          className={
            syles["button"] +
            " " +
            syles[colorType] +
            " " +
            syles[size] +
            " " +
            syles[active] +
            " " +
            syles[selected]
          }
          style={styles}
          type={type}
          name={name}
          value={value}
          data-data={data}
          onClick={onClick}
          {...otherProps}
        />
      </Fragment>
    );
  }

  return <Fragment>{output}</Fragment>;
}

export default PushButton;
