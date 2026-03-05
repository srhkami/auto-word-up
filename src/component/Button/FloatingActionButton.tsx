import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {HTMLAttributes, ReactNode} from "react";

type Props = {
  color?: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" | undefined,
  style?: "outline" | "dash" | "soft" | "ghost" | "link",
  disabled?: boolean,
  buttonContent: ReactNode, // 按鈕的內容
  closeButton?: boolean, // 開啟關閉按鈕
  flower?: boolean, // 開啟花朵模式
  mainAction?: ReactNode, // 主要動作按鈕
}

/**
 * 懸浮多功能按鈕
 * @constructor
 */
export default function FloatingActionButton({
                                               color,
                                               style,
                                               disabled = false,
                                               className,
                                               children,
                                               buttonContent,
                                               closeButton = false,
                                               flower = false,
                                               mainAction = undefined,
                                             }: Props & HTMLAttributes<HTMLDivElement>) {

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
    <div className={flower ? 'fab fab-flower' : 'fab'}>
      {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
      <div tabIndex={0} role="button" className={classes}>{buttonContent}</div>
      {(closeButton && !mainAction) &&
        <div className="fab-close">
          <span className="btn btn-circle btn-lg btn-error">✕</span>
        </div>
      }
      {mainAction}
      {/* buttons that show up when FAB is open */}
      {children}
    </div>
  )
}