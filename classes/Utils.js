export class Utils {
    static randomize(min = 0, max = 1) {
        return Math.random() * (max - min) + min
    }

    static min(array) {
        let min = array[0]

        for (let number of array) {
            if (number < min) {
                min = number
            }
        }

        return min
    }

    static clamp(num, min = 0, max = 1) {
        return Math.min(Math.max(num, min), max)
    }
}