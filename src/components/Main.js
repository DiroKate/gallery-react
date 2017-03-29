require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('data/imageDatas.json');

imageDatas = (function getImageURL(imageDatasArray) {
  for (var i = 0; i < imageDatasArray.length; i++) {
    var singleImageData = imageDatasArray[i];
    singleImageData.imageURL = require('images/' + singleImageData.fileName);
    imageDatasArray[i] = singleImageData;
  }
  return imageDatasArray;
})(imageDatas);

let getRangeRadom = function(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

var ImgFigure = React.createClass({

  render: function() {
    var styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className='img-figure' style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
        </figcaption>
      </figure>
    );
  }
});

var AppComponent = React.createClass({

  Constant: {
    //中心点位置
    centerPos: {
      left: 0,
      top: 0
    },
    //水平方向的取值范围
    hPosRange: {
      leftSecX: [
        0, 0
      ],
      rightSecX: [
        0, 0
      ],
      y: [0, 0]
    },
    vPosRange: {
      x: [
        0, 0
      ],
      topY: [0, 0]
    }

  },
  /**
   * 重新计算图片位置
   * @param  {integer} centerIndex 中心图片的索引
   */
  rerange: function(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRangeLeftSecX = Constant.hPosRange.leftSecX,
      hPosRangeRightSecX = Constant.hPosRange.rightSecX,
      hPosRangeY = Constant.hPosRange.y,
      vPosRangeX = Constant.vPosRange.x,
      vPosRangeTopY = Constant.vPosRange.topY;

    // 处理中心图片
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    imgsArrangeCenterArr[0] = {
      pos: centerPos
    }

    // 处理上半部图片
    var imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), // 取一张图片或者不取
      topImgSpliceIndex = 0;
    //随机索引
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    //上半部图片信息
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    imgsArrangeTopArr.forEach(function(value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          left: getRangeRadom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRadom(vPosRangeTopY[0], vPosRangeTopY[1])
        }
      }
    });

    // 处理左右两个分区的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLeftOrRightX = null;

      // 平均分布在左右两边
      if (i < k) {
        hPosRangeLeftOrRightX = hPosRangeLeftSecX
      } else {
        hPosRangeLeftOrRightX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRadom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRadom(hPosRangeLeftOrRightX[0], hPosRangeLeftOrRightX[1])
        }
      };
    }

    // 插回去state中的imgsArrangeArr
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },
  getInitialState: function() {
    return {
      imgsArrangeArr: [
        /*{
            pos: {
                left: '0',
                top: '0'
            },
            rotate: 0,    // 旋转角度
            isInverse: false,    // 图片正反面
            isCenter: false,    // 图片是否居中
        }*/
      ]};
  },
  /**
   * 生命周期管理函数：渲染成功后
   */
  componentDidMount: function() {

    // 拿到舞台大小
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    // 拿到图片的大小
    const imgFirugeDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      figureW = imgFirugeDOM.scrollWidth,
      figureH = imgFirugeDOM.scrollHeight,
      halfFigureW = Math.ceil(figureW / 2),
      halfFigureH = Math.ceil(figureH / 2);


    // 计算中心位置
    this.Constant.centerPos = {
      left: halfStageW - halfFigureW,
      top: halfStageH - halfFigureH
    }
    // 计算上半部份位置
    this.Constant.vPosRange.x[0] = halfStageW - halfFigureW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfFigureH;
    this.Constant.vPosRange.topY[1] = stageH - halfFigureH * 3;
    // 计算左右两边位置
    this.Constant.hPosRange.y[0] = -halfFigureH;
    this.Constant.hPosRange.y[1] = stageH - halfFigureH;
    this.Constant.hPosRange.leftSecX[0] = -halfFigureW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfFigureW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfFigureW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfFigureW;



    this.rerange(0);

  },

  render: function() {
    let imgFigures = [];
    imageDatas.forEach(function(value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos:{
            left: 0,
            top: 0
          }
        }
      }
      imgFigures.push(
        <ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>
      );
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
      </section>
    );
  }
});
module.exports = AppComponent;
