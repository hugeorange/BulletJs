import React, { Component } from 'react'
import Danmujs from './comps/src/index'

import Raf from './util/raf'
import './app.less'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.page = 1;
    this.screen = null;
    this.danmuInfo = {}
    this.totalPage = 0

    this.dIndex = 0;
    this.raf = new Raf()
  }
  componentDidMount() {
    this.getDanmuInfo()
    this.initScreen()
  }

  initScreen() {
    this.screen = new Danmujs('.screen', {
      trackHeight: 35,
      speed: 80,
      pauseOnClick: true,
    });
  }

  getDanmuInfo = async () => {

    if (this.totalPage && this.totalPage < this.page) return;
    const info = await fetch(`/api/v1/bbs-thread-frontend/31982147?page=${this.page}`).then(res => res.json()).then(res => res)
    
    if (!info) return;
    const rList = info.data.r_list || [];
    this.totalPage = info.data.r_total_page || 1;

    const list = rList.map(v => v.content.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, ''))
      .filter(v => v.length <= 50)

    this.danmuInfo = {
      ...this.danmuInfo,
      [this.page]: list
    }
    this.sendDanmu(this.danmuInfo, this.page)
    this.page++;
  }

  sendDanmu = (obj, page) => {
    // 防止列表出现空的现象
    if (!obj[page].length) {
      this.getDanMuInfo()
      return
    }
    this.sendAction(obj[page])
  }

  sendAction = (list, i = 0) => {

    console.log('this.queeeee--->', this.screen.queues)
    if (list.length === i + 1) {
      this.getDanmuInfo()
      return;
    }
    this.raf.setTimeout(() => {
      const dom = `
        <span style="
          margin: 5px;        
          border: 1px solid;    
          overflow: hidden;
          display: inline-block;
          word-break: keep-all; 
          white-space: nowrap;">
          ${list[i]}
        </span>`
      this.screen.push(dom)
      this.sendAction(list, ++i)
    }, 1000);
  }



  handleSend = () => {
    const dom = `
      <span style="padding: 5px; border: 1px solid; word-break: keep-all; white-space: nowrap;">
        ${++this.dIndex}--
        科比布莱尔特,科比布莱尔特
        ,科比布莱尔特,科比布莱尔特,
        科比布莱尔特,科比布莱尔特,
        科比布莱尔特
      </span>`
    this.screen.push(dom)
  }

  handleSend2 = () => {
    const dom = `
      <span style="padding: 5px; border: 1px solid; word-break: keep-all; white-space: nowrap;">
        ${++this.dIndex}--
        科比布莱尔特
      </span>`
    this.screen.push(dom)
  }

  pause = () => {
    this.screen.pause()
  }
  continue = () => {
    this.screen.resume()
  }

  render() {
    return (
      <div className="app">
        <h1>弹幕开发</h1>
        <div className="danmu-content">
          <div className="screen" style={{ width: '100vw', height: '100%' }}></div>
          <div className="opeate">
            <button onClick={this.handleSend}>手动发送1</button>
            <button onClick={this.handleSend2}>手动发送2</button>
          </div>
          <div className="opeate">
            <button onClick={this.pause}>暂停全部</button>
            <button onClick={this.continue}>继续全部</button>
          </div>
        </div>
      </div>
    )
  }
}
