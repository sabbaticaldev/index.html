let currentDropzone;
let currentDraggedItem;
let currentPosition;
let placeholderElement;

const createPlaceholderElement = () => {
  if (!placeholderElement) {
    placeholderElement = document.createElement("div");
    placeholderElement.classList.add(
      "drag-placeholder",
      "h-24",
      "w-24",
      "bg-primary",
      "border",
      "transition-all",
      "m-auto"
    );
  }
  return placeholderElement;
};

const insertPlaceholder = (parent, position = "end", referenceNode = null) => {
  const placeholder = createPlaceholderElement();
  if (position === "start") {
    parent.insertBefore(placeholder, parent.firstChild);
  } else if (position === "before" && referenceNode) {
    parent.insertBefore(placeholder, referenceNode);
  } else {
    parent.appendChild(placeholder);
  }
};
const removeExistingPlaceholder = (parent) => {
  const existingPlaceholder = parent.querySelector(".drag-placeholder");
  existingPlaceholder?.remove();
};

export default {
  draggable: {
    dragstart: function (event) {
      currentDraggedItem = this.id;
      this.style.opacity = "0.1";
    },

    dragend: function () {
      this.style.opacity = "1";
      if (currentDropzone && currentDraggedItem && !isNaN(currentPosition)) {
        this.dropItem?.({
          dropzone: currentDropzone,
          item: currentDraggedItem,
          position: currentPosition
        });

        // Reset state
        currentDropzone = null;
        currentDraggedItem = null;
        currentPosition = null;
      }

      if (placeholderElement) {
        placeholderElement.remove();
      }
    },

    domReady: function (host) {
      if (host.draggable) {
        host.addEventListener("dragstart", host.dragstart);
        host.addEventListener("dragend", host.dragend);
      }
    },

    domDisconnect: function (host) {
      if (host.draggable) {
        host.removeEventListener("dragstart", host.dragstart);
        host.removeEventListener("dragend", host.dragend);
      }
    }
  },

  dropzone: {
    drop: function (event) {
      event.preventDefault();
      const children = Array.from(event.currentTarget.children);
      currentPosition = children.indexOf(placeholderElement);
      removeExistingPlaceholder(event.currentTarget);
    },

    dragleave: function (event) {
      const dropzoneBounds = event.currentTarget.getBoundingClientRect();
      removeExistingPlaceholder(event.currentTarget);

      if (
        (this.vertical && event.clientY === 0) ||
        (!this.vertical && event.clientX === 0)
      ) {
        currentDropzone = null;
        currentDraggedItem = null;
        currentPosition = null;
      } else if (
        (this.vertical && event.clientY < dropzoneBounds.top) ||
        (!this.vertical && event.clientX < dropzoneBounds.left)
      ) {
        insertPlaceholder(event.currentTarget, "start");
        currentPosition = 0;
      }
    },

    dragover: function (event) {
      event.preventDefault();
      const dropzone = event.currentTarget;
      const items = Array.from(dropzone.children).filter(
        (child) => !child.classList.contains("drag-placeholder")
      );

      if (!items.length) {
        if (!placeholderElement) {
          insertPlaceholder(dropzone);
        }
        currentPosition = 0;
        currentDropzone = dropzone.id;
        return;
      }

      const compareVal = this.vertical ? event.clientY : event.clientX;
      const targetItem = items.find((item, index) => {
        if (
          (this.vertical && item.getBoundingClientRect().top > compareVal) ||
          (!this.vertical && item.getBoundingClientRect().left > compareVal)
        ) {
          currentPosition = index;
          currentDropzone = dropzone.id;
          return true;
        }
        return false;
      });

      if (
        !targetItem &&
        ((this.vertical &&
          compareVal >
            items[items.length - 1].getBoundingClientRect().bottom) ||
          (!this.vertical &&
            compareVal > items[items.length - 1].getBoundingClientRect().right))
      ) {
        currentPosition = items.length;
        currentDropzone = dropzone.id;
      }

      if (
        !placeholderElement ||
        (targetItem && placeholderElement.nextSibling !== targetItem)
      ) {
        insertPlaceholder(dropzone, "before", targetItem);
      }
    },

    domReady: function (host) {
      if (host.dropzone) {
        host.addEventListener("drop", host.drop);
        host.addEventListener("dragover", host.dragover);
        host.addEventListener("dragleave", host.dragleave);
      }
    },

    domDisconnect: function (host) {
      if (host.dropzone) {
        host.removeEventListener("drop", host.drop);
        host.removeEventListener("dragover", host.dragover);
        host.removeEventListener("dragleave", host.dragleave);
      }
    }
  }
};
