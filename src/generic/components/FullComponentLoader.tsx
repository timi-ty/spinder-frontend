import styles from "../styles/FullComponentLoader.module.css";

function FullComponentLoader() {
  return (
    <div className={styles.componentLoader}>
      <img
        title="Spinner"
        className={styles.spinner}
        src="/resources/ic_loader.svg"
      />
    </div>
  );
}

export default FullComponentLoader;
