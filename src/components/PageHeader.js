import React from 'react';
import {Badge, Navbar, NavbarBrand} from 'reactstrap';

export const PageHeader = ({numberOfAuthorsLeft, totalNumberOfAnswers, totalNumberOfCorrectAnswers}) => {
  return <Navbar>
    <NavbarBrand>Это свояк</NavbarBrand>
    {numberOfAuthorsLeft > -1 && <div className={'text-right'}>
      <Badge color={'info'} className={'mr-2'}>Осталось авторов: {numberOfAuthorsLeft}</Badge>
      <Badge color={'primary'} className={'mr-2'}>Всего: {totalNumberOfAnswers}</Badge>
      <Badge color={'success'}>Верных: {totalNumberOfCorrectAnswers}</Badge>
    </div>}
  </Navbar>;
};
