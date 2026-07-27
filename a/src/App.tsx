import { useState } from 'react'
import './App.css'

function App() {
  const [showRules, setShowRules] = useState(false)

  return (
    <div className="game-page">
      <h1 className="game-title">躲避60秒挑战</h1>

      <div className="game-buttons">
        <button className="btn btn-start">开始游戏</button>
        <button
          className="btn btn-rules"
          onClick={() => setShowRules(!showRules)}
        >
          {showRules ? '收起规则' : '游戏规则'}
        </button>
      </div>

      {showRules && (
        <div className="game-rules">
          <h2>游戏规则</h2>
          <ul>
            <li>在60秒内躲避各种障碍物</li>
            <li>使用键盘方向键或鼠标控制角色移动</li>
            <li>碰到障碍物游戏结束</li>
            <li>坚持到60秒即为胜利</li>
            <li>收集道具可获得额外加分</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
