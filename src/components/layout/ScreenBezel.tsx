import type { ReactNode } from "react";
import styles from "./ScreenBezel.module.css";

interface ScreenBezelProps {
  children: ReactNode;
}

export function ScreenBezel({ children }: ScreenBezelProps) {
  return (
    <div className={styles.page}>
      <div className={styles.screenBezel}>
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  );
}
