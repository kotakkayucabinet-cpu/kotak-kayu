const toolbar = document.querySelector("#gallery-tools");
const filters = [...toolbar.querySelectorAll("[data-filter]")];
const projects = [...document.querySelectorAll(".project")];
const count = document.querySelector("#project-count");
const dialog = document.querySelector("#project-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCategory = document.querySelector("#dialog-category");
const dialogDescription = document.querySelector("#dialog-description");
const dialogQuote = document.querySelector("#dialog-quote");
const quoteLink = new URL(dialogQuote.href);
const baseMessage = quoteLink.searchParams.get("text");
let lastProjectLink;

toolbar.hidden = false;
toolbar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button || button.getAttribute("aria-pressed") === "true") return;

  const selection = button.dataset.filter;
  for (const filter of filters) {
    filter.setAttribute("aria-pressed", String(filter === button));
  }

  let shown = 0;
  for (const project of projects) {
    project.hidden = selection !== "all" && project.dataset.category !== selection;
    if (!project.hidden) shown += 1;
  }
  count.textContent = selection === "all"
    ? shown + " projek"
    : shown + " projek · " + button.textContent;
});

document.querySelector(".project-grid").addEventListener("click", (event) => {
  const link = event.target.closest(".project-link");
  if (!link || !dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  lastProjectLink = link;
  const project = link.closest(".project");
  const name = link.querySelector(".project-name").textContent;
  const category = link.querySelector(".project-category").textContent;
  dialogImage.src = link.href;
  dialogImage.alt = link.querySelector("img").alt;
  dialogTitle.textContent = name;
  dialogCategory.textContent = category;
  dialogDescription.textContent = project.querySelector(".project-description").textContent;

  const message = baseMessage.replace("Jenis ruang: __", "Jenis ruang: " + category);
  quoteLink.searchParams.set("text", message + "\nProjek rujukan: " + name);
  dialogQuote.href = quoteLink.href;
  dialog.showModal();
  dialog.scrollTop = 0;
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  lastProjectLink?.focus({ preventScroll: true });
});

const machineGrid = document.querySelector(".machine-grid");
if ("IntersectionObserver" in window) {
  const machineObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    machineGrid.classList.add("is-visible");
    observer.disconnect();
  }, { threshold: 0.2 });
  machineObserver.observe(machineGrid);
} else {
  machineGrid.classList.add("is-visible");
}
