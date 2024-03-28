import { ReactComponentElement } from "react";
export interface ISecondaryLink {
  name: string;
  path: string;
}

export interface IRoute {
  name: string;
  layout: string; 
  icon?: ReactComponentElement | string;
  secondary?: boolean;
  path: string;
  secondaryLinks?: ISecondaryLink[];
}
