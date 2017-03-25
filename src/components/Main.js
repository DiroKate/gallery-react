require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('data/imageDatas.json');


imageDatas = (function getImageURL(imageDatasArray) {
  for (var i = 0; i < imageDatasArray.length; i++) {
    var singleImageData = imageDatasArray[i];
    singleImageData.imageURL = require('images/'+singleImageData.fileName);
    imageDatasArray[i] = singleImageData;
  }
  return imageDatasArray;
})(imageDatas);

var ImgFigure = React.createClass({

  render: function() {
    // var styleObj = {};
    //
    // if (this.props.arrange.pos) {
    //   styleObj = this.props.arrange.pos;
    // }

    return (
      <figure className='img-figure'>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
    </figure>
    );
  }
});

var AppComponent = React.createClass({

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
        ]
    };
  },

  render:function() {
    let imgFigures = [];

    imageDatas.forEach(function(value, index) {
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} />);

    });

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
