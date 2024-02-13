const audioElementMap: Map<number, HTMLAudioElement> = new Map();

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

export { registerAudioElement, unregisterAudioElement, playNextAudioElement };
