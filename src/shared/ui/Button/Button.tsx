import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '',  type = 'button', ...props }: ButtonProps) {
  return <button className={`${styles.button}  ${className}`} type={type} {...props} />;
}
