const cards = document.querySelectorAll(".pokemon-card");
const modal = document.querySelector("dialog");
const closeModal = document.querySelector(".modal-close");



cards.forEach((card) => {
    card.onclick = function () {
        modal.showModal();
    };
});


closeModal.onclick = function () {
    modal.close();
};

