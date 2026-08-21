import Phaser from 'phaser'

export class Start extends Phaser.Scene {
    private selectedShipId: number = 0

    constructor() {
        super('Start')
    }

    create() {
        const tiles = [50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 36, 48, 60, 72, 84]
        const tileSize = 32
        const cols = Math.ceil(this.scale.width / tileSize)
        const rows = Math.ceil(this.scale.height / tileSize)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const frame = Phaser.Math.RND.pick(tiles)
                this.add.image(x * tileSize, y * tileSize, 'tiles', frame).setOrigin(0)
            }
        }

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

        // 飞船选择侧边栏
        this.add.rectangle(80, this.scale.height * 0.5, 140, 560, 0x000000, 0.6).setStrokeStyle(2, 0xf1c40f)
        this.add.text(80, 90, '选择飞船', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '28px',
            color: '#f1c40f',
        }).setOrigin(0.5)

        const shipButtons: Phaser.GameObjects.Image[] = []
        for (let i = 0; i < 12; i++) {
            const col = i % 2
            const row = Math.floor(i / 2)
            const bx = 50 + col * 60
            const by = 140 + row * 70
            const ship = this.add.image(bx, by, 'ships', i)
                .setOrigin(0.5)
                .setScale(0.7)
                .setInteractive({ useHandCursor: true })

            ship.on('pointerover', () => ship.setScale(0.85))
            ship.on('pointerout', () => {
                if (this.selectedShipId === i) ship.setScale(0.85)
                else ship.setScale(0.7)
            })
            ship.on('pointerdown', () => {
                this.selectedShipId = i
                shipButtons.forEach((b, idx) => b.setTint(idx === i ? 0xffffff : 0x888888))
                ship.setScale(0.85)
            })
            ship.setTint(i === this.selectedShipId ? 0xffffff : 0x888888)
            shipButtons.push(ship)
        }

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
            this.scene.start('Game', { shipId: this.selectedShipId })
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
