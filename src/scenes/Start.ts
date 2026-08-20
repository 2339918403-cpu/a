import Phaser from 'phaser'

export class Start extends Phaser.Scene {
    constructor() {
        super('Start')
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e')

        const cx = this.scale.width * 0.5

        // 标题
        this.add.text(cx, 200, '躲避60秒挑战', {
            fontFamily: 'Ma Shan Zheng, ZCOOL KuaiLe, cursive',
            fontSize: '72px',
            color: '#f1c40f',
            stroke: '#c0392b',
            strokeThickness: 8,
        })
            .setOrigin(0.5)
            .setAngle(-2)

        // 开始游戏
        const startBtn = this.add.text(cx, 400, '开始游戏', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '48px',
            color: '#fff',
            backgroundColor: '#c0392b',
            padding: { x: 50, y: 18 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        startBtn.on('pointerover', () => {
            startBtn.setStyle({ color: '#f1c40f' })
            startBtn.setScale(1.05)
        })
        startBtn.on('pointerout', () => {
            startBtn.setStyle({ color: '#fff' })
            startBtn.setScale(1)
        })
        startBtn.on('pointerdown', () => {
            this.scene.start('Game')
        })

        // 游戏规则
        const rulesBtn = this.add.text(cx, 500, '游戏规则', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '36px',
            color: '#fff',
            backgroundColor: '#8e44ad',
            padding: { x: 35, y: 12 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        let rulesVisible = false
        const rulesText = this.add.text(cx, 620, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ecf0f1',
            align: 'center',
            lineSpacing: 12,
            backgroundColor: 'rgba(0,0,0,0.75)',
            padding: { x: 30, y: 20 },
        })
            .setOrigin(0.5)
            .setVisible(false)

        const rulesContent = '在60秒内躲避各种障碍物\n使用键盘方向键(WASD/↑↓←→)控制角色移动\n碰到障碍物游戏结束\n坚持到60秒即为胜利'

        rulesBtn.on('pointerover', () => {
            rulesBtn.setStyle({ color: '#f1c40f' })
            rulesBtn.setScale(1.05)
        })
        rulesBtn.on('pointerout', () => {
            rulesBtn.setStyle({ color: '#fff' })
            rulesBtn.setScale(1)
        })
        rulesBtn.on('pointerdown', () => {
            rulesVisible = !rulesVisible
            rulesBtn.setText(rulesVisible ? '收起规则' : '游戏规则')
            rulesText.setText(rulesVisible ? rulesContent : '')
            rulesText.setVisible(rulesVisible)
        })
    }
}
