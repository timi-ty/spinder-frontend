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

function playAudioElement(audioElementIndex: number) {
  const audioElement = audioElementMap.get(audioElementIndex);
  if (!audioElement) {
    throw new Error(
      `Audio element at index ${audioElementIndex} is not registered.`
    );
  }
  audioElement.play();
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
  playAudioElement,
  addAudioElementTimeUpdateListener,
  removeAudioElementTimeUpdateListener,
  onAudioElementTimeUpdate,
};
