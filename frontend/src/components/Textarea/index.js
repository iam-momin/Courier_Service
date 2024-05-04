import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.module.css";

function Textarea({
  id,
  value,
  onChange,
  rows,
  cols,
  readOnly,
  disabled,
  className,
}) {
  return (
    <textarea
      className={classNames(styles.textarea, className)}
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      cols={cols}
      readOnly={readOnly}
      disabled={disabled}
    />
  );
}

Textarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.number,
  cols: PropTypes.number,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  classes: PropTypes.string,
};

Textarea.defaultProps = {
  text: "",
  className: "",
  onChange: (f) => f,
  rows: 1,
  cols: 1,
  readOnly: false,
  disabled: false,
  classes: "",
};

export default Textarea;
