import React, {Component, Fragment} from 'react';
import {
  Badge,
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Navbar,
  NavbarBrand,
  Row
} from 'reactstrap';
import {Hint} from './Hint';
import {maskedInput, prepareString} from './string-utils';
import data from './si.json';

const ANSWER_INPUT_PREFIX = 'si-answer-';

const initialState = {
  answers: {},
  answerIndicators: {},
  mode: 'hard',
  showResults: false,
  everythingAnsweredCorrectly: false,
  currentlyAnsweredCorrectly: 0,
  totalNumberOfAnswers: 0,
  totalNumberOfCorrectAnswers: 0
};

class App extends Component {
  constructor(props) {
    super(props);
    this.data = Object.assign([], this.props.data || data);
    this.state = {...initialState, currentQuestion: this.randomQuestion()};
    this.handleAnswers = this.handleAnswers.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onNext = this.onNext.bind(this);
    this.isAnswerCorrect = this.isAnswerCorrect.bind(this);
    this.randomQuestion = this.randomQuestion.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion && prevState.currentQuestion !== this.state.currentQuestion) {
      document.getElementById(ANSWER_INPUT_PREFIX + 0).focus();
    }
  }

  handleAnswers(e) {
    e.preventDefault();
    const {answers, currentQuestion} = this.state;
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

  handleOnChange(event) {
    this.setState({answers: {...this.state.answers, [event.target.name]: event.target.value}});
  }

  onNext() {
    const {currentQuestion, currentlyAnsweredCorrectly, totalNumberOfAnswers, totalNumberOfCorrectAnswers} = this.state;
    this.data.splice(this.data.indexOf(currentQuestion), 1);
    this.setState({
      ...initialState,
      currentQuestion: this.randomQuestion(currentQuestion),
      totalNumberOfAnswers: totalNumberOfAnswers + Object.keys(currentQuestion.creations).length,
      totalNumberOfCorrectAnswers: totalNumberOfCorrectAnswers + currentlyAnsweredCorrectly,
    });
  }

  isAnswerCorrect(index) {
    return this.state.answerIndicators[ANSWER_INPUT_PREFIX + index] === 'success';
  }

  showAllAnswers() {
    const {currentQuestion} = this.state;
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

  randomQuestion(currentQuestion) {
    const newQuestion = this.data[Math.floor(Math.random() * this.data.length)];
    if (newQuestion === currentQuestion) {
      return this.randomQuestion(currentQuestion);
    }
    return newQuestion;
  };

  render() {
    const {answers, currentQuestion, mode, showResults, totalNumberOfAnswers, totalNumberOfCorrectAnswers} = this.state;

    return (
      <Fragment>
        <Navbar>
          <NavbarBrand>Это свояк</NavbarBrand>
          {totalNumberOfAnswers > 0 && <div className={'text-right'}>
            <Badge color={'primary'} className={'mr-2'}>Всего: {totalNumberOfAnswers}</Badge>
            <Badge color={'success'} className={'mr-2'}>Верных: {totalNumberOfCorrectAnswers}</Badge>
            <Badge color={'info'}>Осталось авторов: {this.data.length}</Badge>
          </div>}
        </Navbar>
        {this.data.length === 0 && <h2>Игра окончена</h2>}
        {this.data.length > 0 && <Container className={'my-2'}>
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
                               onChange={this.handleOnChange}
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
                    <Button className={'float-right'} color={'info'} onClick={this.onNext} id={'next'}>Следующий
                      автор</Button>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
          {!showResults && <Hint answersToBeMasked={currentQuestion.creations}/>}
          {
            showResults && <div>{this.showAllAnswers()}</div>
          }
        </Container>}

      </Fragment>
    );
  }
}

export default App;
