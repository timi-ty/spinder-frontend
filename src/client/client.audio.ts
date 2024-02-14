const audioElementMap: Map<number, HTMLAudioElement> = new Map();
const timeUpdateListeners: Map<number, (element: HTMLAudioElement) => void> =
  new Map();
var listenerCounter = 0;

function registerAudioElement(element: HTMLAudioElement, position: number) {
  audioElementMap.set(position, element);
}

function unregisterAudioElement(position: number) {
  audioElementMap.delete(position);
}

function playNextAudioElement(currentAudioElementIndex: number) {
  const nextIndex = (currentAudioElementIndex + 1) % audioElementMap.size;
  audioElementMap.get(nextIndex)?.play();
}

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
  registerAudioElement,
  unregisterAudioElement,
  playNextAudioElement,
  addAudioElementTimeUpdateListener,
  removeAudioElementTimeUpdateListener,
  onAudioElementTimeUpdate,
};
