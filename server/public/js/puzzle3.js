// server/public/js/puzzle3.js
// Find the Perfect Fit puzzle logic for BotOrNot

const puzzle3DataUrl = "../models/puzzle_items.json";

// How long in seconds before attempts reset
const resetClock = 30;

// DOM references
const contextContainer = document.getElementById("puzzle3-context");
const candidatesContainer = document.getElementById("puzzle3-candidates");
const ariaStatusRegion3 = document.getElementById("puzzle3-aria-status");
const instructionElement3 = document.getElementById("puzzle3-instruction");

const fitDropzone = document.getElementById("puzzle3-dropzone");
const dropzoneLabel3 = document.getElementById("puzzle3-dropzone-label");

// Internal state
let mistakes3 = 0;

// Category is used for reference row and the correct candidate
let baseCategory = null; 

// Prevents multiple drops 
let hasP3Dropped = false;   

// Shallow shuffle
function p3ShuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Screen-reader announcement
function p3AnnounceStatus(messageText) {
  if (ariaStatusRegion3) {
    ariaStatusRegion3.textContent = messageText;
  }
}

// Build one static (non-draggable) context card
function p3CreateContextCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.draggable = false;

  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Reference icon from category ${item.category}`);

  const icon = document.createElement("img");
  icon.className = "item-icon";
  icon.alt = "";
  icon.src = `../images/${item.category}/${item.fileName}`;
  icon.onerror = () => {
    icon.src = "../images/favicon.ico";
  };

  card.appendChild(icon);
  return card;
}

// Build one draggable candidate card
function p3CreateCandidateCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.draggable = true;

  const id = `${item.category}:${item.fileName}`;
  card.dataset.itemId = id;
  card.dataset.category = item.category;

  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Candidate icon from category ${item.category}`);

  const icon = document.createElement("img");
  icon.className = "item-icon";
  icon.alt = "";
  icon.src = `../images/${item.category}/${item.fileName}`;
  icon.onerror = () => {
    icon.src = "../images/favicon.ico";
  };

  card.appendChild(icon);

  card.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/plain", id);
  });

  return card;
}

// Disable dragging on all candidate cards once the choice is made
function p3DisableAllCandidateDragging() {
  const cards = candidatesContainer.querySelectorAll(".item-card");
  cards.forEach((card) => {
    card.draggable = false;
  });
}

// Attach dropzone behavior for best fit
function p3EnableFitDropzone() {
  fitDropzone.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    fitDropzone.classList.add("dropzone--over");
  });

  fitDropzone.addEventListener("dragleave", () => {
    fitDropzone.classList.remove("dropzone--over");
  });

  fitDropzone.addEventListener("drop", (ev) => {
    ev.preventDefault();
    fitDropzone.classList.remove("dropzone--over");

    if (hasP3Dropped) {
      return;
    }
    hasP3Dropped = true;

    const draggedId = ev.dataTransfer.getData("text/plain");
    const draggedCard = candidatesContainer.querySelector(
      `.item-card[data-item-id="${draggedId}"]`
    );

    if (!draggedCard) return;

    fitDropzone.appendChild(draggedCard);

    const draggedCategory = draggedCard.dataset.category;
    const correct = draggedCategory === baseCategory;

    if (!correct) {
      mistakes3 += 1;
      p3AnnounceStatus("The selected icon may not be the best fit");
    } else {
      p3AnnounceStatus("A matching icon has been selected");
    }

    p3DisableAllCandidateDragging();

    const candidatesTitle = document.getElementById("puzzle3-candidates-title");
    if (candidatesTitle) {
      candidatesTitle.textContent = "Your selection has been recorded";
      candidatesTitle.classList.add("success-banner");
    }

    // Decide success/failure, similar to other puzzles
    const succeeded = mistakes3 === 0;

    let attempts = 0;
    const now = Date.now();
    const timeoutMs = resetClock * 1000;

    try {
      const raw = window.sessionStorage.getItem("botornot-p3-info");
      if (raw) {
        const info = JSON.parse(raw);
        const lastTime = Number(info.timestamp || 0);

        if (now - lastTime < timeoutMs) {
          attempts = Number(info.attempts || 0);
        } else {
          attempts = 0;
        }
      }

      attempts += 1;

      const infoToStore = {
        attempts,
        timestamp: now,
        lastResult: succeeded ? "success" : "fail"
      };

      window.sessionStorage.setItem(
        "botornot-p3-info",
        JSON.stringify(infoToStore)
      );
    } catch (e) {
      attempts = 1;
    }

    if (succeeded) {
      window.location.href = "../results/human-final.html";
    } else {
      // Pass p=3 so suspected pages know to return to puzzle3
      if (attempts === 1) {
        window.location.href = "../results/suspected-bot-1.html?p=3";
      } else if (attempts === 2) {
        window.location.href = "../results/suspected-bot-2.html?p=3";
      } else {
        window.location.href = "../results/bot-final.html";
      }
    }
  });
}

// Initialize Find the Perfect Fit from JSON
async function initializePerfectFit() {
  try {
    const response = await fetch(puzzle3DataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    const categories = Object.keys(data.categories || {});
    if (categories.length < 2) {
      if (instructionElement3) {
        instructionElement3.textContent =
          "Configuration Error: Not enough categories to build this puzzle";
      }
      return;
    }

    // Choose two distinct categories: one for reference, and another is a distinct one
    const shuffledCats = p3ShuffleArray(categories);
    const baseCat = shuffledCats[0];
    const otherCat = shuffledCats[1];
    baseCategory = baseCat;

    const itemsPerPuzzle = data.itemsPerPuzzle || 8;

    // Reference: 7 icons from Base Category
    const contextPool = p3ShuffleArray(data.categories[baseCat]);
    const contextSample = contextPool.slice(0, 7);

    // Candidates: 7 icons from Other Category + 1 from Base Category
    const otherPool = p3ShuffleArray(data.categories[otherCat]);
    const otherSample = otherPool.slice(0, 7);

    const oneMoreFromBase = contextPool[7] || contextPool[0]; // safe fallback
    const candidateItems = p3ShuffleArray([
      ...otherSample,
      oneMoreFromBase
    ]);

    // We intentionally don't show category names in visible text to avoid hints for bots
    const titleEl = document.getElementById("puzzle3-title");
    const contextTitleEl = document.getElementById("puzzle3-context-title");
    const candidatesTitleEl =
      document.getElementById("puzzle3-candidates-title");
    const dropzoneTitleEl =
      document.getElementById("puzzle3-dropzone-title");

    if (titleEl) {
      titleEl.textContent = "Find the Perfect Fit";
    }
    if (contextTitleEl) {
      contextTitleEl.textContent = "Reference icons";
    }
    if (candidatesTitleEl) {
      candidatesTitleEl.textContent = "Candidate icons";
    }
    if (dropzoneTitleEl) {
      dropzoneTitleEl.textContent = "Drop zone for the best match";
    }
    if (instructionElement3) {
      instructionElement3.textContent =
        "Look at the reference icons below, then drag the one candidate icon that best fits with them into the drop zone";
    }
    if (dropzoneLabel3) {
      dropzoneLabel3.textContent = "Best fit";
    }

    // Render non-draggable context
    contextSample.forEach((item) => {
      const card = p3CreateContextCard(item);
      contextContainer.appendChild(card);
    });

    // Render draggable candidates
    candidateItems.forEach((item) => {
      const card = p3CreateCandidateCard(item);
      candidatesContainer.appendChild(card);
    });

    // Enable dropzone
    p3EnableFitDropzone();

    p3AnnounceStatus(
      "Drag the candidate icon that best fits with the reference icons into the drop zone"
    );
  } catch (err) {
    console.error("Failed to load puzzle items for Find the Perfect Fit:", err);
    if (instructionElement3) {
      instructionElement3.textContent =
        "Unable to load puzzle items. Please reload the page or try again";
    }
    p3AnnounceStatus("Puzzle data could not be loaded");
  }
}

// Kick things off
initializePerfectFit();
