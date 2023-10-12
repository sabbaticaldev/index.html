let currentDropzone;
let currentDraggedItem;
let currentPosition;
let placeholderElement;
const createPlaceholderElement = () => {
  if (placeholderElement) return placeholderElement;
  placeholderElement = document.createElement("div");
  placeholderElement.classList.add(
    "drag-placeholder",
    "w-full",
    "h-16",
    "bg-primary",
    "border",
    "transition-all"
  );
  return placeholderElement;
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
      const dropzone = event.currentTarget;
      const items = Array.from(dropzone.children);
      const existingPlaceholder = dropzone.querySelector(".drag-placeholder");

      if (!items.length) {
        if (!existingPlaceholder) {
          const placeholderElem = createPlaceholderElement();
          dropzone.appendChild(placeholderElem);
        }
        currentPosition = 0;
        currentDropzone = dropzone.id;
        return;
      }

      let targetItem = items.find((item, index) => {
        if (item.getBoundingClientRect().top > event.clientY) {
          currentPosition = index;
          currentDropzone = dropzone.id;
          return true;
        }
        return false;
      });

      if (
        !targetItem &&
        event.clientY > items[items.length - 1].getBoundingClientRect().bottom
      ) {
        currentPosition = items.length;
        currentDropzone = dropzone.id;
      }

      // If placeholder doesn't exist or if it's not in its right position, adjust it
      if (
        !existingPlaceholder ||
        (targetItem && existingPlaceholder.nextSibling !== targetItem)
      ) {
        const placeholderElem =
          existingPlaceholder || createPlaceholderElement();
        targetItem
          ? dropzone.insertBefore(placeholderElem, targetItem)
          : dropzone.appendChild(placeholderElem);
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
