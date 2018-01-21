import React, {Component, Fragment} from 'react';
import {Button, ListGroup, ListGroupItem} from 'reactstrap';
import {maskedInput} from './string-utils';

export class Hint extends Component {
  constructor(props) {
    super(props);
    this.state = {showHint: false};
  }

  render() {
    const {answersToBeMasked} = this.props;
    return (<Fragment>
      <Button outline color={'dark'} size={'sm'} onClick={() => this.setState({showHint: !this.state.showHint})}>
        <span>&nbsp;?&nbsp;</span>
      </Button>
      {this.state.showHint && <ListGroup className={'mt-2'}>{answersToBeMasked.map((item, index) => {
        return <ListGroupItem key={index} color={'info'}>{maskedInput(item)}</ListGroupItem>
      })}
      </ListGroup>}
    </Fragment>);
  }
}
