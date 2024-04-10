import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStatus } from "../state/slice.auth";
import { StoreState, ResourceStatus, dispatch } from "../state/store";
import { getDiscoverDestinations } from "../client/client.api";
import { DiscoverDestinationData } from "../client/client.model";
import {
  loadDiscoverDestinationResource,
  injectDiscoverDestinationResource,
  errorDiscoverDestinationResource,
} from "../state/slice.discoverdestination";

function useDiscoverDestinationResource() {
  const authStatus = useSelector<StoreState, AuthStatus>(
    (state) => state.authState.status
  );
  const resourceStatus = useSelector<StoreState, ResourceStatus>(
    (state) => state.discoverDestinationState.status
  );
  useEffect(() => {
    if (resourceStatus !== "Empty") {
      console.log(
        `Already using Discover Destination Resource:: Status: ${resourceStatus}`
      );
      return;
    }
    loadDiscoverDestination();
  }, [authStatus]);

  return { resourceStatus, loadDiscoverDestination };
}

function loadDiscoverDestination() {
  dispatch(loadDiscoverDestinationResource());

  //Load the first page of the resource.
  getDiscoverDestinations(0)
    .then((discoverDestinationData: DiscoverDestinationData) => {
      console.log(
        `Using Discover Destination:: ${JSON.stringify(
          discoverDestinationData
        )}.`
      );
      dispatch(injectDiscoverDestinationResource(discoverDestinationData));
    })
    .catch((error) => {
      console.error(error);
      dispatch(errorDiscoverDestinationResource());
      console.error("Failed to use Discover Destinations:: Error.");
    });
}

export default useDiscoverDestinationResource;
