import IconButton from "../generic/components/IconButton";
import SearchArea from "../generic/components/SearchArea";
import TitleBar from "../generic/components/TitleBar";
import "./ComponentViewer.scss";

const isViewingComponent = true;

function ComponentViewer() {
  return (
    <div className="component-viewer">
      {/* <SearchArea onSearch={() => {}} /> */}
      {/* <IconButton icon={"/src/assets/ic_close.png"} onAction={() => {}} /> */}
      <TitleBar title={"Title"} onClose={() => {}} />
    </div>
  );
}

export default ComponentViewer;

export { isViewingComponent };
