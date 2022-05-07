import * as React from 'react';

export const userAcountType = {
  0: 'Standar user',
  1: "Admin",
  2: "Super Admin"
}

export interface dataTypes {
  fields: [...{
    name: string
  }[]],
  rows: [{
    Id: number,
    bus_number: number,
    departure_time: string,
    destination: string
  }]
}

export interface ModalProp {
  children: React.ReactChild,

  isOpen: boolean,
  handleOnClose?: () => void,
  shouldBeCloseOnOutsideClick?: boolean,
}

export interface optionListType {
  name: string,
  color: string,
  vote:number
}

export interface PoolProp {
  id: number | string,
  name: string,
  question: string,
  options: string,
}

export interface ObjectPushType {
  [key: string]: any;
}

export interface VoteType {
  vote: number
}