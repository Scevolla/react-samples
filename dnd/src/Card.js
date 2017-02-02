import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const wrapperStyle = {
  padding: '3px 6px'
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move'
};

const cardDragSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      status: props.status
    };
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },

  endDrag(props) {
  }
};

const cardDropTarget = {
  hover(props, monitor, component) {
    const item = monitor.getItem();

    if (props.id === item.id)
      return;

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    const dragIndex = item.index;
    const hoverIndex = props.index;

    if (item.status !== props.status) {
      var insertAfter = hoverClientY > hoverMiddleY;
      item.index = hoverIndex + (insertAfter ? 1 : 0);
      item.status = props.status;
      props.moveCard(item.id, props.id, props.status, insertAfter);     
      return;
    }

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveCard(item.id, props.id);
    item.index = hoverIndex;
  }
};

function cardDragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function cardDropCollect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Card extends Component {
  render() {
    const { text, connectDragSource, connectDropTarget,isDragging} = this.props;   
    let newStyle = Object.assign({}, style);
    newStyle.opacity = (isDragging) ? 0.5 : 1;

    return connectDropTarget(connectDragSource(
      <div style={wrapperStyle}>
        <div style={newStyle}>
          {this.props.text}
        </div>
      </div>
    ));
  }
}

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  id: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired
};


var drag1 = DragSource(ItemTypes.CARD, cardDragSource, cardDragCollect)(Card);
var drop1 = DropTarget(ItemTypes.CARD, cardDropTarget, cardDropCollect)(drag1);
export default drop1;
