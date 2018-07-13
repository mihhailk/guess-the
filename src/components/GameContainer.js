import React, {Component, Fragment} from 'react';
import {Badge, Button, Col, Container, FormGroup, Input, Label, ListGroup, ListGroupItem, Row} from 'reactstrap';
import {Hint} from './Hint';
import {ANSWER_INPUT_PREFIX} from '../constants';
import {maskedInput, prepareString} from '../string-utils';

export class GameContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {answerIndicators: {}, showResults: false};
    this.handleAnswers = this.handleAnswers.bind(this);
    this.isAnswerCorrect = this.isAnswerCorrect.bind(this);
  }

  componentWillUpdate(prevProps) {
    if (this.props.currentQuestion !== prevProps.currentQuestion) {
      this.setState({showResults: false, answerIndicators: {}});
    }
  }

  handleAnswers(e) {
    e.preventDefault();
    const {answers, currentQuestion} = this.props;
    this.setState({showResults: true});
    const answerIndicators = Object.assign({}, this.state.answerIndicators);
    let numberOfCorrectAnswers = 0;
    const numberOfAnswers = Object.keys(currentQuestion.creations).length;
    Object.keys(answers).forEach((inputName) => {
      const isCorrectAnswer = currentQuestion.creations.some(item => prepareString(item) === prepareString(answers[inputName]));
      answerIndicators[inputName] = isCorrectAnswer ? 'success' : 'danger';
      if (isCorrectAnswer) {
        numberOfCorrectAnswers++;
      }
    });
    this.setState({
      answerIndicators,
      everythingAnsweredCorrectly: numberOfCorrectAnswers === numberOfAnswers,
      currentlyAnsweredCorrectly: numberOfCorrectAnswers
    });
    document.getElementById('next').focus();
  }

  isAnswerCorrect(index) {
    return this.state.answerIndicators[ANSWER_INPUT_PREFIX + index] === 'success';
  }

  showAllAnswers() {
    const {currentQuestion} = this.props;
    if (this.state.everythingAnsweredCorrectly) {
      return (<Col md={6}>
        <ListGroup>
          <ListGroupItem color={'primary'}>Всё правильно</ListGroupItem>
          {currentQuestion.notes &&
          <ListGroupItem color="info">{currentQuestion.notes}</ListGroupItem>}
        </ListGroup>
      </Col>);
    }
    return <Col md={6}>
      <h2>Все правильные ответы:</h2>
      <ListGroup>
        {currentQuestion.creations.map((item, index) => {
          return <ListGroupItem key={index} color={'success'}>{item}</ListGroupItem>
        })}
        {currentQuestion.notes &&
        <Fragment><ListGroupItem/><ListGroupItem color="info">{currentQuestion.notes}</ListGroupItem></Fragment>}
      </ListGroup>
    </Col>;
  }

  render() {
    const {answers, currentQuestion, mode, onInputChange, onNext} = this.props;
    const {showResults} = this.state;
    return <Container className={'my-2'}>
      <Label for={'answer'}>{currentQuestion.author}</Label>
      <Row className={'mb-2'}>
        <Col md={'10'} className={'d-flex-md'}>
          <form onSubmit={this.handleAnswers} autoComplete={'off'}>
            {currentQuestion.creations.map((item, index) => {
              const answerKey = ANSWER_INPUT_PREFIX + index;
              const isAnsweredCorrectly = this.isAnswerCorrect(index);
              return <FormGroup key={index}>
                <Row>
                  <Col xs={12} sm={8}>
                    <Input type={'text'}
                           autoComplete={'off'}
                           id={answerKey}
                           name={answerKey}
                           placeholder={mode === 'easy' ? maskedInput(item) : ''}
                           value={answers[answerKey] || ''}
                           onChange={onInputChange}
                           readOnly={showResults}/>
                  </Col>
                  <Col xs={12} sm={4}>
                    {showResults && <Badge color={isAnsweredCorrectly ? 'success' : 'danger'}>
                      {isAnsweredCorrectly ? 'Верно' : 'Неверно'}
                    </Badge>}
                  </Col>
                </Row>
              </FormGroup>
            })}
            <Row>
              <Col xs={12} sm={8}>{!showResults &&
              <Button className={'float-right mb-1'} color={'primary'} onClick={this.handleAnswers}
                      type={'submit'}>OK</Button>}
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={8}>
                <Button className={'float-right'} color={'info'}
                        onClick={() => onNext(showResults ? this.state.currentlyAnsweredCorrectly : 0)}
                        id={'next'}>Следующий автор</Button>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
      {!showResults && <Hint answersToBeMasked={currentQuestion.creations}/>}
      {showResults && <div>{this.showAllAnswers()}</div>}
    </Container>;
  }
}
