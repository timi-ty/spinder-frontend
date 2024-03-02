import SearchArea from "../generic/components/SearchArea";
import "./ComponentViewer.scss";

const isViewingComponent = false;

function ComponentViewer() {
  return (
    <div className="component-viewer">
      <SearchArea
        onSearch={function (text: string): void {}}
        onTextChanged={function (text: string): void {}}
        hint={""}
        isLoading={true}
      />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
