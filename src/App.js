import React, {Component, Fragment} from 'react';
import {PageHeader} from './components/PageHeader';
import {GameContainer} from './components/GameContainer';
import {GameOver} from "./components/GameOver";
import {ANSWER_INPUT_PREFIX, ANSWERED_QUESTIONS_IDS, TOTAL_ANSWERS_KEY, TOTAL_CORRECT_ANSWERS_KEY} from './constants';
import * as ls from 'local-storage';
import data from './si.json';

const initialState = {
  answers: {},
  mode: 'hard',
  totalNumberOfAnswers: ls.get(TOTAL_ANSWERS_KEY) || 0,
  totalNumberOfCorrectAnswers: ls.get(TOTAL_CORRECT_ANSWERS_KEY) || 0,
  answeredQuestionId: null
};

const answeredQuestionsIds = () => {
  return JSON.parse(ls.get(ANSWERED_QUESTIONS_IDS)) || [];
};

class App extends Component {
  constructor(props) {
    super(props);
    this.data = Object.assign([], this.props.data || data);
    this.state = this.getInitialState();
    this.handleOnNext = this.handleOnNext.bind(this);
    this.handleOnInputChange = this.handleOnInputChange.bind(this);
    this.randomQuestion = this.randomQuestion.bind(this);
    this.startOver = this.startOver.bind(this);
  }

  getInitialState() {
    const answeredIds = answeredQuestionsIds();
    return {
      ...initialState,
      numberOfAuthorsLeft: this.data.filter((question, id) => !answeredIds.includes(id)).length,
      currentQuestion: this.randomQuestion()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion && prevState.currentQuestion !== this.state.currentQuestion) {
      const firstInput = document.getElementById(ANSWER_INPUT_PREFIX + 0);
      if (firstInput) {
        firstInput.focus();
      }
    }

    if (this.state.answeredQuestionId !== null && this.state.answeredQuestionId !== prevState.answeredQuestionId) {
      let answered = answeredQuestionsIds();
      answered.push(this.state.answeredQuestionId);
      ls.set(ANSWERED_QUESTIONS_IDS, JSON.stringify(answered));
    }

    if (this.state.totalNumberOfAnswers !== prevState.totalNumberOfAnswers) {
      ls.set(TOTAL_ANSWERS_KEY, this.state.totalNumberOfAnswers);
    }

    if (this.state.totalNumberOfCorrectAnswers !== prevState.totalNumberOfCorrectAnswers) {
      ls.set(TOTAL_CORRECT_ANSWERS_KEY, this.state.totalNumberOfCorrectAnswers);
    }
  }

  handleOnInputChange(event) {
    this.setState({answers: {...this.state.answers, [event.target.name]: event.target.value}});
  }

  handleOnNext(currentlyAnsweredCorrectly) {
    const {currentQuestion, totalNumberOfAnswers, totalNumberOfCorrectAnswers, numberOfAuthorsLeft} = this.state;
    const isGameOver = numberOfAuthorsLeft - 1 === 0;
    this.setState({
      ...initialState,
      currentQuestion: isGameOver ? null : this.randomQuestion(currentQuestion),
      totalNumberOfAnswers: totalNumberOfAnswers + Object.keys(currentQuestion.creations).length,
      totalNumberOfCorrectAnswers: totalNumberOfCorrectAnswers + currentlyAnsweredCorrectly,
      numberOfAuthorsLeft: numberOfAuthorsLeft - 1,
      answeredQuestionId: this.data.indexOf(currentQuestion)
    });
  }

  randomQuestion(currentQuestion) {
    let unansweredQuestions = this.data.filter((question, id) => !answeredQuestionsIds().includes(id));
    if (unansweredQuestions.length === 0) return null;

    let nextQuestionIndex = Math.floor(Math.random() * unansweredQuestions.length);
    const newQuestion = unansweredQuestions[nextQuestionIndex];
    if (newQuestion === currentQuestion) {
      return this.randomQuestion(currentQuestion);
    }
    return newQuestion;
  }

  startOver() {
    ls.clear();
    this.setState(this.getInitialState());
  }


  render() {
    const {
      answers, currentQuestion, mode, totalNumberOfAnswers, totalNumberOfCorrectAnswers, numberOfAuthorsLeft
    } = this.state;

    return (
      <Fragment>
        <PageHeader totalNumberOfAnswers={totalNumberOfAnswers}
                    totalNumberOfCorrectAnswers={totalNumberOfCorrectAnswers}
                    numberOfAuthorsLeft={numberOfAuthorsLeft}/>
        {
          numberOfAuthorsLeft === 0 && <GameOver onRestart={this.startOver}/>
        }
        {
          numberOfAuthorsLeft >= 0 && currentQuestion !== null &&
          <GameContainer currentQuestion={currentQuestion}
                         answers={answers}
                         mode={mode}
                         onNext={this.handleOnNext}
                         onInputChange={this.handleOnInputChange}/>
        }
      </Fragment>
    );
  }
}

export default App;
