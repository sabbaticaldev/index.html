let currentDropzone;
let currentDraggedItem;
let currentPosition;

export default {
  draggable: {
    dragstart: function (event) {
      console.log(this.id);
      currentDraggedItem = this.id;
    },
    dragend: function (event) {
      // If ondrop is supplied, invoke it
      this.dropItem?.({
        dropzone: currentDropzone,
        item: currentDraggedItem,
        position: currentPosition
      });

      // Reset the variables after the drop operation is complete
      currentDropzone = null;
      currentDraggedItem = null;
      currentPosition = null;
    },
    domReady(host) {
      if (host.draggable) {
        host.addEventListener("dragstart", host.dragstart);
        host.addEventListener("dragend", host.dragend);
      }
    },

    domDisconnect(host) {
      if (host.draggable) {
        host.removeEventListener("dragstart", host.dragstart);
        host.removeEventListener("dragend", host.dragend);
      }
    }
  },
  dropzone: {
    drop: function (event) {
      event.preventDefault();
      const placeholder =
        event.currentTarget.querySelector(".drag-placeholder");
      if (placeholder) {
        const children = Array.from(event.currentTarget.children);
        currentPosition = children.indexOf(placeholder);
        placeholder.remove();
        // Find the position where the item is dropped based on the placeholder's position
      }
    },
    dragleave: (event) => {
      console.log("leave dropzone");
      const dropzone = event.currentTarget;
      const dropzoneTop = dropzone.getBoundingClientRect().top;

      // Remove any existing placeholder
      const placeholder = dropzone.querySelector(".drag-placeholder");
      if (placeholder) {
        placeholder.remove();
      }

      // Check if the drag left through the top boundary of the dropzone
      if (event.clientY < dropzoneTop) {
        const placeholderElem = document.createElement("div");
        placeholderElem.classList.add(
          "drag-placeholder",
          "w-full",
          "h-16",
          "bg-primary",
          "border",
          "transition-all"
        );

        // Insert the placeholder at the beginning of the dropzone
        dropzone.insertBefore(placeholderElem, dropzone.firstChild);
        currentPosition = 0;
      }
    },
    dragover: (event) => {
      event.preventDefault();

      // Remove existing placeholder, if any
      const existingPlaceholder =
        event.currentTarget.querySelector(".drag-placeholder");
      if (existingPlaceholder) {
        existingPlaceholder.remove();
      }

      // Determine the closest list item to the mouse cursor
      const items = Array.from(event.currentTarget.children); // Assuming direct children are the items

      // If the drag position is above the top of the first item,
      // set targetItem as the first item so the placeholder will be inserted at the beginning
      let targetItem =
        items[0].getBoundingClientRect().top > event.clientY ? items[0] : null;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.getBoundingClientRect().top > event.clientY) {
          targetItem = item;
          currentPosition = i;
          currentDropzone = event.currentTarget.id;
          break;
        }
      }

      // If drag is over the last item
      if (
        !targetItem &&
        event.clientY > items[items.length - 1].getBoundingClientRect().bottom
      ) {
        currentPosition = items.length; // Position after the last item
        currentDropzone = event.currentTarget.id;
      }
      // Insert the new placeholder either before the identified item or at the end if no item is identified
      const placeholderElem = document.createElement("div");
      placeholderElem.classList.add(
        "drag-placeholder",
        "w-full",
        "h-16",
        "bg-primary",
        "border",
        "transition-all"
      );

      if (targetItem) {
        event.currentTarget.insertBefore(placeholderElem, targetItem);
      } else {
        event.currentTarget.appendChild(placeholderElem);
      }
    },

    domReady(host) {
      if (host.dropzone) {
        host.addEventListener("drop", host.drop);
        host.addEventListener("dragover", host.dragover);
        host.addEventListener("dragleave", host.dragleave);
      }
    },

    domDisconnect(host) {
      if (host.dropzone) {
        host.removeEventListener("dragstart", host.dragstart);
        host.removeEventListener("drop", host.drop);
        host.removeEventListener("dragover", host.dragover);
      }
    }
  }
};
