namespace Sound {

    export class SoundItem {

        public startTime = 0;

        public duration: number = -1;

        public enabled: boolean = true;

        public constructor(public readonly buffer: AudioBuffer, public readonly index: number) {
        }

    }

}