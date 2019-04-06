import { Address } from "nem-library";

export interface IEventData {
  senderId: string;
  comments: string;
  date: number;
}

export interface IBirthEventData extends IEventData {
  parents: string[];
  country: string;
}

export interface IFoundEventData extends IEventData {
  country: string;
  estimatedBirth: number;
}
