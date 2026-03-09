import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

type Props = {
  readonly className?: string,
  readonly divider?: boolean, // 分隔線（預設為否）
  readonly children: ReactNode,
}

export default function ModalFooter({className, divider = false, children}: Props) {

  const classes = twMerge(
    'flex items-center justify-end gap-2',
    className,
  )

  return (
    <>
      {divider &&
        <div className='divider my-0'></div>
      }
      <div className={classes}>
        {children}
      </div>
    </>
  )
}