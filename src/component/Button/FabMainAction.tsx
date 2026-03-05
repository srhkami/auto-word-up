import {type ButtonHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";

type Props = {
  label?: string, // 顯示的文字
  color?: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" | undefined,
  style?: "outline" | "dash" | "soft" | "ghost" | "link",
}

/**
 * 浮動按鈕的主要操作按鈕
 * @param color
 * @param style
 * @param disabled
 * @param onClick
 * @param className
 * @param title
 * @param children
 * @constructor
 */
export default function FabMainAction({
                                        color,
                                        style,
                                        disabled = false,
                                        onClick,
                                        className,
                                        label='',
                                        children
                                      }: Props & ButtonHTMLAttributes<HTMLButtonElement>) {

  const classes = twMerge(
    'btn btn-circle btn-lg',
    className,
    clsx({
      'btn-outline': style === 'outline',
      'btn-dash': style === 'dash',
      'btn-soft': style === 'soft',
      'btn-ghost': style === 'ghost',
      'btn-link': style === 'link',
      'btn-disabled': disabled,
      'btn-neutral': color === 'neutral',
      'btn-primary': color === 'primary',
      'btn-secondary': color === 'secondary',
      'btn-accent': color === 'accent',
      'btn-info': color === 'info',
      'btn-success': color === 'success',
      'btn-warning': color === 'warning',
      'btn-error': color === 'error',
    })
  );

  return (
    <div className="fab-main-action">
      <span className='font-semibold'>
        {label}
      </span>
      <button className={classes} onClick={onClick} title={label}>
        {children}
      </button>
    </div>
  )
}