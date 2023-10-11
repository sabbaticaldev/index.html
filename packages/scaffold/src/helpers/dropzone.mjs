let currentDropzone;
let currentDraggedItem;
let currentPosition;

const createPlaceholderElement = () => {
  const elem = document.createElement("div");
  elem.classList.add(
    "drag-placeholder",
    "w-full",
    "h-16",
    "bg-primary",
    "border",
    "transition-all"
  );
  return elem;
};

const removeExistingPlaceholder = (parent) => {
  const existingPlaceholder = parent.querySelector(".drag-placeholder");
  existingPlaceholder?.remove();
};

export default {
  draggable: {
    dragstart: function (event) {
      currentDraggedItem = this.id;
    },

    dragend: function () {
      if (currentDropzone && currentDraggedItem && currentPosition) {
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
      currentPosition = children.findIndex((child) =>
        child.classList.contains("drag-placeholder")
      );
      removeExistingPlaceholder(event.currentTarget);
    },

    dragleave: function (event) {
      const dropzoneTop = event.currentTarget.getBoundingClientRect().top;
      removeExistingPlaceholder(event.currentTarget);

      if (event.clientY === 0) {
        currentDropzone = null;
        currentDraggedItem = null;
        currentPosition = null;
      } else if (event.clientY < dropzoneTop) {
        const placeholderElem = createPlaceholderElement();
        event.currentTarget.insertBefore(
          placeholderElem,
          event.currentTarget.firstChild
        );
        currentPosition = 0;
      }
    },

    dragover: function (event) {
      event.preventDefault();
      const items = Array.from(event.currentTarget.children);

      removeExistingPlaceholder(event.currentTarget);

      let targetItem = items.find((item, index) => {
        if (item.getBoundingClientRect().top > event.clientY) {
          currentPosition = index;
          currentDropzone = event.currentTarget.id;
          return true;
        }
        return false;
      });

      if (
        !targetItem &&
        event.clientY > items[items.length - 1].getBoundingClientRect().bottom
      ) {
        currentPosition = items.length;
        currentDropzone = event.currentTarget.id;
      }

      const placeholderElem = createPlaceholderElement();
      targetItem
        ? event.currentTarget.insertBefore(placeholderElem, targetItem)
        : event.currentTarget.appendChild(placeholderElem);
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
