import Phaser from 'phaser'
import ASSETS from '../assets'

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader')
    }

    init() {
        const centreX = this.scale.width * 0.5
        const centreY = this.scale.height * 0.5

        const barWidth = 468
        const barHeight = 32
        const barMargin = 4

        this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff)

        const bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff)

        this.load.on('progress', (progress: number) => {
            bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress)
        })
    }

    preload() {
        for (const type in ASSETS) {
            for (const key in (ASSETS as Record<string, Record<string, { key: string; args: unknown[] }>>)[type]) {
                const asset = (ASSETS as Record<string, Record<string, { key: string; args: unknown[] }>>)[type][key]
                const args = asset.args.slice()
                args.unshift(asset.key)
                ;(this.load as unknown as Record<string, (...a: unknown[]) => void>)[type].apply(this.load, args)
            }
        }
    }

    create() {
        this.scene.start('Start')
    }
}
