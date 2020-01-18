import React from 'react';
import {Badge, Navbar, NavbarBrand} from 'reactstrap';

export const PageHeader = ({totalNumberOfAnswers, totalNumberOfCorrectAnswers, numberOfAuthorsLeft}) => {
  return <Navbar>
    <NavbarBrand>Это свояк</NavbarBrand>
    <div className={'text-right'}>
      <Badge color={'primary'} className={'mr-2'}>Всего: {totalNumberOfAnswers}</Badge>
      <Badge color={'success'} className={'mr-2'}>Верных: {totalNumberOfCorrectAnswers}</Badge>
      <Badge color={'info'}>Осталось авторов: {numberOfAuthorsLeft}</Badge>
    </div>
  </Navbar>;
};
