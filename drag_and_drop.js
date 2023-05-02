contentBoxes.forEach((contentBox) => {
  contentBox.addEventListener('dragstart', dragStart);
  contentBox.addEventListener('dragend', dragEnd);
});

dropZones.forEach((dropZone) => {
  dropZone.addEventListener('dragover', dragOver);
  dropZone.addEventListener('dragenter', dragEnter);
  dropZone.addEventListener('dragleave', dragLeave);
  dropZone.addEventListener('drop', drop);
});

let draggedElement = null;
let draggedElementParent = null;

function dragStart() {
  draggedElement = this;
  draggedElementParent = this.parentNode;

  this.classList.add('dragging');
}

function dragEnd() {
  this.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.target.classList.add('dragover');
}

function dragLeave(e) {
  e.target.classList.remove('dragover');
}

async function drop(e) {
  e.preventDefault();
  overlayAll.style.display = 'block'

  e.target.classList.remove('dragover');

  let status = 'all'
  if (this.classList.value === 'ongoing-box') status = 'ongoing'
  if (this.classList.value === 'done-box') status = 'done'

  await changeStatusDB(status, draggedElement.id)
  await getAllItemsInDB(userid)
}
