import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TweenMax, Power2 } from 'gsap';
import { Card, Header, Title, Icon, Content } from './styles/noteStyles';
import { randomColor } from '../utils/color';
import { useNotes } from '../hooks/useNotes';

const tweenOptions = {
  transform: `scale(0)`,
  transformOrigin: `center`,
  ease: Power2.easeIn,
};

const Note = ({ id, title, content }) => {
  const [isAnimating, setAnimating] = useState(true);
  const { removeNote } = useNotes();
  const cardRef = useRef();
  const iconRef = useRef();

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const removeFunc = () => {
      icon.removeEventListener(`click`, removeFunc, false);
      TweenMax.to(card, 0.4, {
        ...tweenOptions,
        autoAlpha: 0,
        onComplete: removeNote,
        onCompleteParams: [id],
      });
    };

    if (isAnimating) {
      setAnimating(false);
      TweenMax.fromTo(
        card,
        0.5,
        {
          ...tweenOptions,
        },
        {
          autoAlpha: 1,
          transform: `scale(1)`,
        },
      );
    } else {
      TweenMax.set(card, { autoAlpha: 1 });
    }

    icon.addEventListener(`click`, removeFunc, false);

    return () => {
      icon.removeEventListener(`click`, removeFunc, false);
    };
  }, [id, isAnimating, removeNote]);

  return (
    <Card ref={cardRef} id={id} style={{ backgroundColor: randomColor() }}>
      <Header>
        <Title>{title}</Title>
        <Icon ref={iconRef} src="/images/deleteIcon.svg" alt="Delete Note" />
      </Header>
      <Content>{content}</Content>
    </Card>
  );
};

export default Note;

Note.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
