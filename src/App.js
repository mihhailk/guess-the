import React, {Component, Fragment} from 'react';
import {PageHeader} from './components/PageHeader';
import {GameContainer} from './components/GameContainer';
import {ANSWER_INPUT_PREFIX} from './constants';
import data from './si.json';

const initialState = {
  answers: {},
  mode: 'hard',
  totalNumberOfAnswers: 0,
  totalNumberOfCorrectAnswers: 0
};

class App extends Component {
  constructor(props) {
    super(props);
    this.data = Object.assign([], this.props.data || data);
    this.state = {...initialState, currentQuestion: this.randomQuestion()};
    this.handleOnNext = this.handleOnNext.bind(this);
    this.handleOnInputChange = this.handleOnInputChange.bind(this);
    this.randomQuestion = this.randomQuestion.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion && prevState.currentQuestion !== this.state.currentQuestion) {
      document.getElementById(ANSWER_INPUT_PREFIX + 0).focus();
    }
  }

  handleOnInputChange(event) {
    this.setState({answers: {...this.state.answers, [event.target.name]: event.target.value}});
  }

  handleOnNext(currentlyAnsweredCorrectly) {
    const {currentQuestion, totalNumberOfAnswers, totalNumberOfCorrectAnswers} = this.state;
    this.data.splice(this.data.indexOf(currentQuestion), 1);
    this.setState({
      ...initialState,
      currentQuestion: this.randomQuestion(currentQuestion),
      totalNumberOfAnswers: totalNumberOfAnswers + Object.keys(currentQuestion.creations).length,
      totalNumberOfCorrectAnswers: totalNumberOfCorrectAnswers + currentlyAnsweredCorrectly,
    });
  }

  randomQuestion(currentQuestion) {
    const newQuestion = this.data[Math.floor(Math.random() * this.data.length)];
    if (newQuestion === currentQuestion) {
      return this.randomQuestion(currentQuestion);
    }
    return newQuestion;
  };

  render() {
    const {answers, currentQuestion, mode, totalNumberOfAnswers, totalNumberOfCorrectAnswers} = this.state;

    return (
      <Fragment>
        <PageHeader totalNumberOfAnswers={totalNumberOfAnswers}
                    totalNumberOfCorrectAnswers={totalNumberOfCorrectAnswers}
                    numberOfAuthorsLeft={this.data.length}/>
        {this.data.length === 0 && <h2>Игра окончена</h2>}
        {this.data.length > 0 && <GameContainer currentQuestion={currentQuestion}
                                                answers={answers}
                                                mode={mode}
                                                onNext={this.handleOnNext}
                                                onInputChange={this.handleOnInputChange}/>}
      </Fragment>
    );
  }
}

export default App;
