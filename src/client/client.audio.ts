const timeUpdateListeners: Map<number, (element: HTMLAudioElement) => void> =
  new Map();
var listenerCounter = 0;

//Returns a number handle that can be used to remove the added listener.
function addAudioElementTimeUpdateListener(
  onTimeUpdate: (element: HTMLAudioElement) => void
): number {
  timeUpdateListeners.set(listenerCounter, onTimeUpdate);
  return listenerCounter++;
}

function removeAudioElementTimeUpdateListener(handle: number) {
  timeUpdateListeners.delete(handle);
}

function onAudioElementTimeUpdate(element: HTMLAudioElement) {
  timeUpdateListeners.forEach((listener) => {
    listener(element);
  });
}

export {
  addAudioElementTimeUpdateListener,
  removeAudioElementTimeUpdateListener,
  onAudioElementTimeUpdate,
};
