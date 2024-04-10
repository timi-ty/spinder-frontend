import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStatus } from "../state/slice.auth";
import { StoreState, ResourceStatus, dispatch } from "../state/store";
import { getDiscoverSources } from "../client/client.api";
import { DiscoverSourceData } from "../client/client.model";
import {
  loadDiscoverSourceResource,
  injectDiscoverSourceResource,
  errorDiscoverSourceResource,
} from "../state/slice.discoversource";

function useDiscoverSourceResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const resourceStatus = useSelector<StoreState, ResourceStatus>(
    (state) => state.discoverSourceState.status
  );
  useEffect(() => {
    if (resourceStatus !== "Empty") {
      console.log(
        `Aready using Discover Source Resource:: Status: ${resourceStatus}`
      );
      return;
    }
    loadDiscoverSource();
  }, [authStatus]);

  return { resourceStatus, loadDiscoverSource };
}

function loadDiscoverSource() {
  dispatch(loadDiscoverSourceResource());

  getDiscoverSources()
    .then((discoverSourceData: DiscoverSourceData) => {
      console.log(
        `Using Discover Sources:: ${JSON.stringify(discoverSourceData)}.`
      );
      dispatch(injectDiscoverSourceResource(discoverSourceData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorDiscoverSourceResource());
      console.error("Failed to use Discover Sources:: Error.");
    });
}

export default useDiscoverSourceResource;
