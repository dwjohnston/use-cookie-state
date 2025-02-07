import Image from "next/image";
import styles from "./page.module.css";
import { UserProfile1 } from "@/responsive_cookies/components/UserProfile1";

export default function Home() {
  return (
    <div className={styles.page}>
      <UserProfile1/>
    </div>
  );
}
