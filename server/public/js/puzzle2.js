// server/public/js/puzzle2.js
// Spot the Odd puzzle logic for BotOrNot

const puzzle2DataUrl = "../models/puzzle_items.json";

// How long in seconds before attempts reset
const resetClock = 30;

// DOM references
const itemsContainer = document.getElementById("puzzle2-items");
const ariaStatusRegion2 = document.getElementById("puzzle2-aria-status");
const instructionElement2 = document.getElementById("puzzle2-instruction");

const oddDropzone = document.getElementById("puzzle2-dropzone");
const dropzoneLabel = document.getElementById("puzzle2-dropzone-label");

// Internal state
let mistakes2 = 0;
let oddCategory = null;   // category for the odd icon
let hasDropped = false;   // prevent multiple drops

// Random integer [min, max]
function p2RandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shallow shuffle
function p2ShuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Screen-reader announcement
function p2AnnounceStatus(messageText) {
  if (ariaStatusRegion2) {
    ariaStatusRegion2.textContent = messageText;
  }
}

// Build one draggable card (same visual style as other puzzles)
function p2CreateDraggableCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.draggable = true;

  const id = `${item.category}:${item.fileName}`;
  card.dataset.itemId = id;
  card.dataset.category = item.category;

  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Icon from category ${item.category}`);

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

// Disable dragging once selection is made
function p2DisableAllDragging() {
  const cards = itemsContainer.querySelectorAll(".item-card");
  cards.forEach((card) => {
    card.draggable = false;
  });
}

// Attach single dropzone behavior
function p2EnableOddDropzone() {
  oddDropzone.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    oddDropzone.classList.add("dropzone--over");
  });

  oddDropzone.addEventListener("dragleave", () => {
    oddDropzone.classList.remove("dropzone--over");
  });

  oddDropzone.addEventListener("drop", (ev) => {
    ev.preventDefault();
    oddDropzone.classList.remove("dropzone--over");

    if (hasDropped) {
      return; // ignore extra drops
    }
    hasDropped = true;

    const draggedId = ev.dataTransfer.getData("text/plain");
    const draggedCard = itemsContainer.querySelector(
      `.item-card[data-item-id="${draggedId}"]`
    );

    if (!draggedCard) return;

    oddDropzone.appendChild(draggedCard);

    const draggedCategory = draggedCard.dataset.category;
    const correct = draggedCategory === oddCategory;

    if (!correct) {
      mistakes2 += 1;
      p2AnnounceStatus("The selected icon may not be the odd one out");
    } else {
      p2AnnounceStatus("An odd icon has been selected");
    }

    // Prevent further dragging
    p2DisableAllDragging();

    // Neutral completion message
    const itemsTitle = document.getElementById("puzzle2-items-title");
    if (itemsTitle) {
      itemsTitle.textContent = "Your selection has been recorded";
      itemsTitle.classList.add("success-banner");
    }

    // Decide success/failure, similar to other puzzles
    const succeeded = mistakes2 === 0;

    let attempts = 0;
    const now = Date.now();
    const timeoutMs = resetClock * 1000;

    try {
      const raw = window.sessionStorage.getItem("botornot-p2-info");
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
        "botornot-p2-info",
        JSON.stringify(infoToStore)
      );
    } catch (e) {
      attempts = 1;
    }

    if (succeeded) {
      // Success page
      window.location.href = "../results/human-final.html";
    } else {
      // Pass p=2 so suspected pages know to return to puzzle2
      if (attempts === 1) {
        window.location.href = "../results/suspected-bot-1.html?p=2";
      } else if (attempts === 2) {
        window.location.href = "../results/suspected-bot-2.html?p=2";
      } else {
        window.location.href = "../results/bot-final.html";
      }
    }
  });
}

// Initialize Spot the Odd from JSON
async function initializeSpotTheOdd() {
  try {
    const response = await fetch(puzzle2DataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    const categories = Object.keys(data.categories || {});
    if (categories.length < 2) {
      if (instructionElement2) {
        instructionElement2.textContent =
          "Configuration Error: Not enough categories to build this puzzle";
      }
      return;
    }

    // Choose two distinct categories
    const shuffledCats = p2ShuffleArray(categories);
    const majorityCategory = shuffledCats[0];
    const oddCategoryLocal = shuffledCats[1];
    oddCategory = oddCategoryLocal;

    const itemsPerPuzzle = data.itemsPerPuzzle || 8;
    const majorityCount = 7;
    const oddCount = itemsPerPuzzle - majorityCount; // should be 1

    const majorityPool = p2ShuffleArray(data.categories[majorityCategory]);
    const oddPool = p2ShuffleArray(data.categories[oddCategoryLocal]);

    const sampleMajority = majorityPool.slice(0, majorityCount);
    const sampleOdd = oddPool.slice(0, oddCount);

    const mixedItems = p2ShuffleArray([...sampleMajority, ...sampleOdd]);

    // We intentionally don't show category names in the UI to avoid hints to bots
    const titleEl = document.getElementById("page-title");
    const itemsTitleEl = document.getElementById("puzzle2-items-title");
    const dropzoneTitleEl = document.getElementById("puzzle2-dropzone-title");

    if (titleEl) {
      titleEl.textContent = "SPOT THE ODD";
    }
    if (itemsTitleEl) {
      itemsTitleEl.textContent = "Icons";
    }
    if (dropzoneTitleEl) {
      dropzoneTitleEl.textContent = "Drop zone for the odd icon";
    }
    if (instructionElement2) {
      instructionElement2.textContent =
        "Among these icons, seven belong to one category and one belongs to a different category. Drag only the icon that does not belong into the drop zone";
    }
    if (dropzoneLabel) {
      dropzoneLabel.textContent = "Odd one out";
    }

    // Render 8 cards
    mixedItems.forEach((item) => {
      const card = p2CreateDraggableCard(item);
      itemsContainer.appendChild(card);
    });

    // Enable dropzone
    p2EnableOddDropzone();

    p2AnnounceStatus("Drag the icon that does not belong into the odd drop zone");
  } catch (err) {
    console.error("Failed to load puzzle items for Spot the Odd:", err);
    if (instructionElement2) {
      instructionElement2.textContent =
        "Unable to load puzzle items. Please reload the page or try again";
    }
    p2AnnounceStatus("Puzzle data could not be loaded");
  }
}

// Kick things off
initializeSpotTheOdd();
