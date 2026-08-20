import Phaser from 'phaser'

type GameOverData = {
    result: 'win' | 'lose'
    timeLeft: number
}

export class Game extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image
    private obstacles!: Phaser.Physics.Arcade.Group
    private keys!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasdKeys!: {
        up: Phaser.Input.Keyboard.Key
        down: Phaser.Input.Keyboard.Key
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
    }
    private timeText!: Phaser.GameObjects.Text
    private scoreText!: Phaser.GameObjects.Text
    private timeLeft: number = 60
    private score: number = 0
    private gameOver: boolean = false
    private obstacleSpawnEvent?: Phaser.Time.TimerEvent
    private countdownEvent?: Phaser.Time.TimerEvent

    constructor() {
        super('Game')
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e')

        const cx = this.scale.width * 0.5

        // 标题
        this.add.text(cx, 30, '躲避60秒挑战', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '32px',
            color: '#f1c40f',
        }).setOrigin(0.5)

        // 倒计时
        this.timeText = this.add.text(cx, 80, '60', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '48px',
            color: '#fff',
            stroke: '#c0392b',
            strokeThickness: 6,
        }).setOrigin(0.5)

        // 得分
        this.scoreText = this.add.text(this.scale.width - 30, 30, '得分: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#fff',
        }).setOrigin(1, 0)

        // 玩家（黄色圆形）
        this.player = this.physics.add.image(cx, this.scale.height * 0.6, '')
            .setCircle(22)
            .setDisplaySize(44, 44)
            .setTint(0xf1c40f)
            .setCollideWorldBounds(true)

        // 障碍物组
        this.obstacles = this.physics.add.group({
            allowGravity: false,
            immovable: false,
        })

        // 碰撞检测
        this.physics.add.overlap(this.player, this.obstacles, this.handleCollision, undefined, this)

        // 键盘输入
        this.keys = this.input.keyboard!.createCursorKeys()
        this.wasdKeys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }

        // 初始化
        this.timeLeft = 60
        this.score = 0
        this.gameOver = false
        this.updateScore()

        // 障碍物生成
        this.obstacleSpawnEvent = this.time.addEvent({
            delay: 700,
            loop: true,
            callback: this.spawnObstacle,
            callbackScope: this,
        })

        // 倒计时
        this.countdownEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.tickCountdown,
            callbackScope: this,
        })
    }

    private spawnObstacle() {
        if (this.gameOver) return

        const w = this.scale.width
        const h = this.scale.height
        const side = Phaser.Math.Between(0, 3)
        let x: number, y: number, vx: number, vy: number

        const speed = Phaser.Math.Between(100, 250)

        switch (side) {
            case 0:
                x = Phaser.Math.Between(0, w)
                y = -40
                vx = Phaser.Math.Between(-80, 80)
                vy = speed
                break
            case 1:
                x = w + 40
                y = Phaser.Math.Between(100, h)
                vx = -speed
                vy = Phaser.Math.Between(-80, 80)
                break
            case 2:
                x = Phaser.Math.Between(0, w)
                y = h + 40
                vx = Phaser.Math.Between(-80, 80)
                vy = -speed
                break
            default:
                x = -40
                y = Phaser.Math.Between(100, h)
                vx = speed
                vy = Phaser.Math.Between(-80, 80)
                break
        }

        const size = Phaser.Math.Between(30, 60)
        const colors = [0xe74c3c, 0x3498db, 0x2ecc71, 0x9b59b6, 0xe67e22, 0x1abc9c]
        const color = colors[Phaser.Math.Between(0, colors.length - 1)]

        const obstacle = this.add.rectangle(x, y, size, size, color)
        this.physics.add.existing(obstacle)
        const body = obstacle.body as Phaser.Physics.Arcade.Body
        body.setVelocity(vx, vy)
        body.setCollideWorldBounds(false)
        body.setAllowGravity(false)

        this.obstacles.add(obstacle)

        this.time.addEvent({
            delay: 4000,
            callback: () => {
                if (obstacle.active) obstacle.destroy()
            },
            callbackScope: this,
        })
    }

    private tickCountdown() {
        if (this.gameOver) return

        this.timeLeft--
        this.timeText.setText(String(this.timeLeft))

        if (this.timeLeft <= 10) {
            this.timeText.setColor('#e74c3c')
        }

        if (this.timeLeft <= 0) {
            this.endGame('win')
        }
    }

    private handleCollision() {
        if (this.gameOver) return
        this.endGame('lose')
    }

    private endGame(result: 'win' | 'lose') {
        this.gameOver = true
        this.obstacleSpawnEvent?.remove(false)
        this.countdownEvent?.remove(false)

        this.time.delayedCall(500, () => {
            const data: GameOverData = { result, timeLeft: this.timeLeft }
            this.scene.start('GameOver', data)
        })
    }

    private updateScore() {
        this.scoreText.setText(`得分: ${this.score}`)
    }

    update() {
        if (this.gameOver) return

        const speed = 280

        if (this.keys.left.isDown || this.wasdKeys.left.isDown) {
            this.player.setVelocityX(-speed)
        } else if (this.keys.right.isDown || this.wasdKeys.right.isDown) {
            this.player.setVelocityX(speed)
        } else {
            this.player.setVelocityX(0)
        }

        if (this.keys.up.isDown || this.wasdKeys.up.isDown) {
            this.player.setVelocityY(-speed)
        } else if (this.keys.down.isDown || this.wasdKeys.down.isDown) {
            this.player.setVelocityY(speed)
        } else {
            this.player.setVelocityY(0)
        }
    }
}
