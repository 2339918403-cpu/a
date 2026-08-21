import Phaser from 'phaser'
import Player from '../gameObjects/Player'
import EnemyFlying from '../gameObjects/EnemyFlying'
import Explosion from '../gameObjects/Explosion'

type GameOverData = {
    result: 'win' | 'lose'
    timeLeft: number
}

export class Game extends Phaser.Scene {
    public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player!: Player
    private enemies!: Phaser.GameObjects.Group
    private bgTiles!: Phaser.GameObjects.Image[]
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
    private enemySpawnEvent?: Phaser.Time.TimerEvent
    private countdownEvent?: Phaser.Time.TimerEvent
    private bgScrollSpeed: number = 2
    private shipId: number = 0

    constructor() {
        super('Game')
    }

    create(data: { shipId?: number }) {
        this.shipId = data.shipId ?? 0

        const tiles = [50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 110, 110, 110, 110, 36, 48, 60, 72, 84]
        const tileSize = 32
        const cols = Math.ceil(this.scale.width / tileSize)
        const rows = Math.ceil(this.scale.height / tileSize) + 1
        this.bgTiles = []
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const frame = Phaser.Math.RND.pick(tiles)
                const tile = this.add.image(x * tileSize, y * tileSize, 'tiles', frame).setOrigin(0)
                this.bgTiles.push(tile)
            }
        }

        const cx = this.scale.width * 0.5

        this.add.text(cx, 30, '躲避60秒挑战', {
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: '32px',
            color: '#f1c40f',
        }).setOrigin(0.5).setDepth(50)

        this.timeText = this.add.text(cx, 80, '60', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '48px',
            color: '#fff',
            stroke: '#c0392b',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(50)

        this.scoreText = this.add.text(this.scale.width - 30, 30, '得分: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#fff',
        }).setOrigin(1, 0).setDepth(50)

        this.player = new Player(this, cx, this.scale.height * 0.75, this.shipId)

        this.enemies = this.add.group()

        this.cursors = this.input.keyboard!.createCursorKeys()
        this.wasdKeys = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }

        this.timeLeft = 60
        this.score = 0
        this.gameOver = false
        this.updateScore()

        this.enemySpawnEvent = this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: this.spawnEnemy,
            callbackScope: this,
        })

        this.countdownEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.tickCountdown,
            callbackScope: this,
        })
    }

    private spawnEnemy() {
        if (this.gameOver) return

        const shipId = Phaser.Math.Between(0, 11)
        const pathId = Phaser.Math.Between(0, 3)
        const speed = Phaser.Math.FloatBetween(0.002, 0.005)
        const power = Phaser.Math.Between(1, 3)

        const enemy = new EnemyFlying(this, shipId, pathId, speed, power)
        this.enemies.add(enemy)

        this.physics.add.overlap(this.player, enemy, this.handleCollision, undefined, this)
    }

    private tickCountdown() {
        if (this.gameOver) return

        this.timeLeft--
        this.timeText.setText(String(this.timeLeft))
        this.score += 10
        this.updateScore()

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
        this.enemySpawnEvent?.remove(false)
        this.countdownEvent?.remove(false)

        new Explosion(this, this.player.x, this.player.y)
        this.player.destroy()

        this.time.delayedCall(800, () => {
            const data: GameOverData = { result, timeLeft: this.timeLeft }
            this.scene.start('GameOver', data)
        })
    }

    private updateScore() {
        this.scoreText.setText(`得分: ${this.score}`)
    }

    update() {
        if (this.gameOver) return

        const tileSize = 32
        for (const tile of this.bgTiles) {
            tile.y += this.bgScrollSpeed
            if (tile.y >= this.scale.height) {
                tile.y -= this.scale.height + tileSize
                tile.x = Math.floor(tile.x / tileSize) * tileSize
            }
        }
    }

    addExplosion(x: number, y: number) {
        new Explosion(this, x, y)
    }

    removeEnemy(enemy: EnemyFlying) {
        enemy.destroy()
    }

    removeBullet(_bullet: unknown) {}
    removeEnemyBullet(_bullet: unknown) {}
    fireBullet(_x: number, _y: number) {}
    fireEnemyBullet(_x: number, _y: number, _power: number) {}
}
