import styles from "../styles/EmptyView.module.css";

function EmptyView() {
  return (
    <div className={styles.emptyView}>
      <div>There is nothing here.</div>
    </div>
  );
}

export default EmptyView;
