import { createAnimation } from '@ionic/core';

export const ToastEnterAnimation = (baseEl, position) => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper');
  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(0px + var(--ion-safe-area-top, 0px))`;
  wrapperAnimation.addElement(wrapperEl);
  switch (position) {
    case 'top':
      wrapperEl.style.top = top;
      wrapperAnimation
        .beforeStyles({ 'will-change': 'transform' })
        .beforeStyles({ 'padding-top': '30px' })
        .fromTo('opacity', 0.01, 1)
        .fromTo('transform', 'translateY(-100%)', `translateY(${top})`);
      break;
    case 'middle':
      const topPosition = Math.floor(hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation
        .beforeStyles({ 'will-change': 'transform' })
        .fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperEl.style.bottom = bottom;
      wrapperAnimation
        .beforeStyles({ 'will-change': 'transform' })
        .fromTo('opacity', 0.01, 1)
        .fromTo('transform', 'translateY(100%)', `translateY(${bottom})`);
      break;
  }
  return baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation(wrapperAnimation);
};

export const ToastLeaveAnimation = (baseEl, position) => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper');
  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(0px + var(--ion-safe-area-top, 0px))`;
  switch (position) {
    case 'top':
      wrapperAnimation
        .addElement(wrapperEl)
        .fromTo('opacity', 1, 0.01)
        .fromTo('transform', `translateY(${top})`, 'translateY(-100%)')
        .afterStyles({ 'padding-top': '0px' });
      break;
    case 'middle':
      wrapperAnimation
        .addElement(wrapperEl)
        .fromTo('opacity', 1, 0.01);
      break;
    default:
      wrapperAnimation
        .addElement(wrapperEl)
        .fromTo('opacity', 1, 0.01)
        .fromTo('transform', `translateY(${bottom})`, 'translateY(100%)');
      break;
  }
  return baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .addAnimation(wrapperAnimation);
};
