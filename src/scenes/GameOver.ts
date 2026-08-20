import Phaser from 'phaser'

type GameOverData = {
    result: 'win' | 'lose'
    timeLeft: number
}

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver')
    }

    create(data: GameOverData) {
        const isWin = data.result === 'win'
        const cx = this.scale.width * 0.5
        const cy = this.scale.height * 0.5

        this.cameras.main.setBackgroundColor(isWin ? '#1a4a2e' : '#4a1a1a')

        // 标题
        const title = isWin ? '挑战成功！' : '挑战失败'
        this.add.text(cx, cy - 120, title, {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '72px',
            color: '#f1c40f',
            stroke: '#000',
            strokeThickness: 8,
        }).setOrigin(0.5)

        // 结果
        const resultText = isWin
            ? '你成功躲避了所有障碍物！'
            : `你在第 ${60 - data.timeLeft} 秒被击中了`
        this.add.text(cx, cy - 30, resultText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#fff',
        }).setOrigin(0.5)

        // 剩余时间
        this.add.text(cx, cy + 30, `剩余时间: ${data.timeLeft} 秒`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ecf0f1',
        }).setOrigin(0.5)

        // 再来一局
        const restartBtn = this.add.text(cx, cy + 120, '再来一局', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#c0392b',
            padding: { x: 45, y: 15 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        restartBtn.on('pointerover', () => {
            restartBtn.setStyle({ color: '#f1c40f' })
            restartBtn.setScale(1.05)
        })
        restartBtn.on('pointerout', () => {
            restartBtn.setStyle({ color: '#fff' })
            restartBtn.setScale(1)
        })
        restartBtn.on('pointerdown', () => {
            this.scene.start('Game')
        })

        // 返回主页
        const menuBtn = this.add.text(cx, cy + 210, '返回主页', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '32px',
            color: '#ecf0f1',
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        menuBtn.on('pointerover', () => {
            menuBtn.setStyle({ color: '#f1c40f' })
            menuBtn.setScale(1.05)
        })
        menuBtn.on('pointerout', () => {
            menuBtn.setStyle({ color: '#ecf0f1' })
            menuBtn.setScale(1)
        })
        menuBtn.on('pointerdown', () => {
            this.scene.start('Start')
        })
    }
}
