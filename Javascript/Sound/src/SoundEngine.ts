namespace Sound {

    export class SoundEngine {

        private readonly context: AudioContext = new AudioContext();

        private sounds: SoundItem[] = [];

        private playingSounds: AudioBufferSourceNode[] = [];

        private nextSoundIndex: number = 0;

        private nextPlayingSoundIndex: number = 0;

        public getSounds(): SoundItem[] {
            let result = [];
            for (let i in this.sounds) {
                result.push(this.sounds[i]);
            }
            return result;
        }

        public play(soundIndex: number, options: { loop: boolean } = { loop: false }): number {

            // Confirm sound index is valid
            if (soundIndex < 0 || soundIndex >= this.sounds.length) {
                throw 'Invalid sound index.';
            }

            // Confirm the sound has been enabled
            let result = -1;
            let item = this.sounds[soundIndex];
            if (item.enabled) {
                let soundSource = this.context.createBufferSource();
                soundSource.buffer = item.buffer;
                soundSource.connect(this.context.destination);

                // We need to keep track of sounds that loop so that they can be stopped
                if (options.loop) {
                    soundSource.loop = true;
                    this.playingSounds[this.nextPlayingSoundIndex] = soundSource;
                    result = this.nextPlayingSoundIndex;
                    this.nextPlayingSoundIndex++;
                }

                // Play the sound
                if (item.startTime == 0 && item.duration == -1) {
                    soundSource.start();
                } else {
                    soundSource.start(0, item.startTime, item.duration == -1 ? undefined : item.duration);
                }
            }
            return result;
        }

        public stop(playingSoundIndex: number) {
            if (playingSoundIndex < 0 || playingSoundIndex >= this.playingSounds.length) {
                throw 'Invalid sound index.';
            }
            this.playingSounds[playingSoundIndex].stop();
            delete this.playingSounds[playingSoundIndex];
        }

        public addSoundMap(soundMap: SoundMap, successCallback: (items: SoundItem[]) => void, errorCallback: (errorMessage: string) => void) {
            this.createAudioBufferFromFile(soundMap.fileName, (buffer: AudioBuffer) => {
                let newItems: SoundItem[] = [];
                for (let region of soundMap.items) {
                    let item = new SoundItem(buffer, this.nextSoundIndex);
                    item.startTime = region.startTime;
                    item.duration = region.duration;
                    this.sounds[this.nextSoundIndex] = item;
                    newItems.push(item);
                    this.nextSoundIndex++;
                }
                if (successCallback !== undefined && successCallback !== null) {
                    successCallback(newItems);
                }
            }, errorCallback)
        }

        public addFile(fileName: string, successCallback: (item: SoundItem) => void, errorCallback: (errorMessage: string) => void) {
            this.createAudioBufferFromFile(fileName, (buffer: AudioBuffer) => {
                let item = new SoundItem(buffer, this.nextSoundIndex);
                this.sounds[this.nextSoundIndex] = item;
                this.nextSoundIndex++;
                if (successCallback !== undefined && successCallback !== null) {
                    successCallback(item);
                }
            }, errorCallback);
        }

        public addFiles(fileNames: string[], successCallback: (items: SoundItem[]) => void, errorCallback: (errorMessage: string) => void) {
            let loadedCount = 0;
            let items: SoundItem[] = [];

            // Are we loading any files?
            if (fileNames.length == 0) {
                successCallback([]);
                return;
            }

            // Function to load the next file
            let i = -1;
            let loadNextFile = () => {
                this.addFile(fileNames[++i], (item: SoundItem) => {

                    // Have we loaded all files?
                    items.push(item);
                    loadedCount++;
                    if (loadedCount < fileNames.length) {
                        loadNextFile();
                    } else if (successCallback !== undefined && successCallback !== null) {
                        successCallback(items);
                    }

                }, errorCallback);
            };

            // Start loading!
            loadNextFile();
        }

        public removeFile(soundIndex: number) {
            let sound = this.sounds[soundIndex];
            for (let playingSoundIndex in this.playingSounds) {
                let playingSound = this.playingSounds[playingSoundIndex];
                if (playingSound.buffer == sound.buffer) {
                    this.stop(Number(playingSoundIndex));
                }
            }
            delete this.sounds[soundIndex];
        }

        private createAudioBufferFromFile(fileName: string, successCallback: (buffer: AudioBuffer) => void, errorCallback: (errorMessage: string) => void) {

            // Create a request to download the file
            let request = new XMLHttpRequest();
            request.open('GET', fileName, true);
            request.responseType = 'arraybuffer';
            request.onload = (ev: Event) => {

                // Decode audio data
                this.context.decodeAudioData(request.response, (decodedData: AudioBuffer) => {
                    if (successCallback !== undefined && successCallback !== null) {
                        successCallback(decodedData);
                    }
                });
            };

            // Handle errors
            request.onerror = function (ev: ProgressEvent) {
                if (errorCallback !== undefined && errorCallback !== null) {
                    errorCallback('Cannot load "' + fileName + '".');
                }
            };

            // Get the file!
            request.send();
        }

    }

}