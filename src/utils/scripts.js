const tl = new TimelineMax();
const tOptions = {
  x: 200,
  autoAlpha: 0,
  ease: Power2.easeOut,
};

const removeNote = e => {
  const card = e.target.parentNode;
  tl.remove(
    TweenMax.to(card, 0.5, { autoAlpha: 0, onComplete: deleteNode, onCompleteParams: [card] }, 0),
  );
};

// const deleteNode = node => {
//   document.getElementById("list").removeChild(node);
// };

const createNote = () => {
  const notes = document.getElementById('note-text').value.split('\n');
  notes.forEach(note => {
    const notesElement = document.createElement('p');
    notesElement.appendChild(document.createTextNode(note));
    card.appendChild(notesElement);
  });

  tl.add(TweenMax.from(card, 0.5, tOptions, 0));
};
