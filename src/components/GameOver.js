import React from 'react';
import {Button} from 'reactstrap';

export const GameOver = ({onRestart}) => {
  return <div className={'text-center'}>
    <h2>Игра окончена</h2>
    <Button onClick={onRestart} color={'primary'} className={'primary mt-2'}>Начать заново</Button>
  </div>
};
