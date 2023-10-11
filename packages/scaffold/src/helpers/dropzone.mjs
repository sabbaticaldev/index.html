export let dragged;
export default {
  draggable: {
    dragstart: function (event) {
      dragged = this.id || "teste";
      event.dataTransfer.setData("dragged", this.id);
    },
    dragend: (event) => {
      console.log(dragged);
      console.log("end drag maldito");
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
    drop: (event) => {
      console.log(dragged);
      event.preventDefault();
    },
    dragover: (event) => {
      console.log(dragged);
      event.preventDefault();
    },

    domReady(host) {
      if (host.dropzone) {
        host.addEventListener("drop", host.drop);
        host.addEventListener("dragover", host.dragover);
      }
    },

    domDisconnect(host) {
      if (host.dropzone) {
        host.removeEventListener("dragstart", host.dragstart);
        host.removeEventListener("dragover", host.dragover);
      }
    }
  }
};
