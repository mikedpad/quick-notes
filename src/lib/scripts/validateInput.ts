import { nanoid } from 'nanoid';
import type { FormInputElement } from '$types/types';

function getId(str: string) {
  return `${str}-${nanoid()}`;
}

function onInput(e: Event) {
  const target = e.target as FormInputElement;
  target.setCustomValidity('');
  target.checkValidity();
}

function onInvalid(e: Event) {
  const target = e.target as FormInputElement;
  if (target.value === ``) {
    target.setCustomValidity(`${target.name} is required.`);
  }
}

export function getValidityListeners(str: string) {
  return {
    id: getId(str),
    onInput,
    onInvalid,
  };
}
