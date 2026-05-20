import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <>
      <input
        className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        id={inputId}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}
